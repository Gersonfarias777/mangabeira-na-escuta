/**
 * Mangabeira na Escuta - Canal de Escuta / Ouvidoria (Google Apps Script)
 * Segue o POP-01 - Ouvidoria e Canal de Escuta do Mangabeira Shopping.
 * Script vinculado a uma planilha nova (container-bound): use a planilha
 * ativa como destino dos registros, sem precisar fixar um ID.
 */

var CANAL_CONFIG = {
  SPREADSHEET_NAME: 'MANGABEIRA NA ESCUTA',
  SHEET_NAME: '01_COLETA',
  FOLLOWUP_SHEET_NAME: '02_ACOMPANHAMENTO',
  DASHBOARD_SHEET_NAME: '03_DASHBOARD',
  PRESENTATION_SHEET_NAME: '04_APRESENTAÇÃO',
  LISTS_SHEET_NAME: '99_LISTAS',
  DRIVE_FOLDER_NAME: 'Canal de Escuta - Anexos (Formulario)',
  DEST_EMAIL: 'canaldeescuta@mangabeirashopping.com.br',
  MAX_FILE_BYTES: 8 * 1024 * 1024,
  ALLOWED_MIME_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
  PROTOCOL_PREFIX: 'ME-'
};

var CANAL_TIPOS = ['Elogio', 'Sugestão', 'Crítica', 'Denúncia'];

var CANAL_CATEGORIAS_DENUNCIA = [
  'Assédio moral',
  'Assédio sexual',
  'Discriminação (raça, gênero, orientação sexual, religião, etc.)',
  'Riscos psicossociais / saúde mental (NR-1)',
  'Segurança do trabalho / condições inseguras',
  'Corrupção, fraude ou desvio',
  'Conflito de interesses',
  'Descumprimento de normas internas',
  'Outro'
];

function doGet(event) {
  var view = event && event.parameter ? String(event.parameter.view || '') : '';
  var path = event && event.pathInfo ? String(event.pathInfo).replace(/^\/+|\/+$/g, '') : '';
  if (view !== 'form' && path !== 'form') {
    assertCanalDashboardAccess_();
    return HtmlService.createHtmlOutputFromFile('Dashboard')
      .setTitle('Mangabeira na Escuta | Visão Executiva')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Mangabeira na Escuta')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function assertCanalDashboardAccess_() {
  var email = String(Session.getActiveUser().getEmail() || '').toLowerCase();
  var allowed = email === CANAL_CONFIG.DEST_EMAIL.toLowerCase() || /@mangabeirashopping\.com\.br$/.test(email);
  if (!allowed) throw new Error('Acesso restrito à equipe autorizada do Mangabeira Shopping.');
  return email;
}

function getCanalDashboardData() {
  assertCanalDashboardAccess_();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var coleta = spreadsheet.getSheetByName(CANAL_CONFIG.SHEET_NAME);
  var acompanhamento = spreadsheet.getSheetByName(CANAL_CONFIG.FOLLOWUP_SHEET_NAME);
  if (!coleta || !acompanhamento) throw new Error('Estrutura da planilha não encontrada.');
  var coletaRows = coleta.getLastRow() > 1 ? coleta.getRange(2, 1, coleta.getLastRow() - 1, 22).getDisplayValues() : [];
  var followRows = acompanhamento.getLastRow() > 1 ? acompanhamento.getRange(2, 1, acompanhamento.getLastRow() - 1, 33).getDisplayValues() : [];
  function countBy(rows, index, order) { var counts = {}; order.forEach(function(key) { counts[key] = 0; }); rows.forEach(function(row) { var value = row[index] || 'Não informado'; counts[value] = (counts[value] || 0) + 1; }); return Object.keys(counts).map(function(label) { return {label: label, value: counts[label]}; }); }
  var closed = followRows.filter(function(row) { return row[4] === 'Concluída' || row[4] === 'Arquivada'; });
  var open = followRows.filter(function(row) { return row[0] && row[4] !== 'Concluída' && row[4] !== 'Arquivada'; });
  var completedDays = closed.map(function(row) { return Number(String(row[29]).replace(',', '.')) || 0; }).filter(function(value) { return value >= 0; });
  var avgDays = completedDays.length ? completedDays.reduce(function(sum, value) { return sum + value; }, 0) / completedDays.length : 0;
  var cases = open.map(function(row) { return {protocol: row[0], status: row[4], priority: row[5], responsible: row[6] || 'Não atribuído', days: Number(row[29]) || 0, deadline: row[30] || 'Não informado'}; }).sort(function(a, b) { return b.days - a.days; }).slice(0, 10);
  return {generatedAt:new Date().toISOString(),kpis:{total:coletaRows.filter(function(row){return row[1];}).length,open:open.length,critical:followRows.filter(function(row){return row[5]==='Crítica';}).length,overdue:followRows.filter(function(row){return row[30]==='Vencido';}).length,completed:closed.length,avgDays:Math.round(avgDays*10)/10},status:countBy(followRows.filter(function(row){return row[0];}),4,['Recebida','Em triagem','Em investigação','Plano de ação','Aguardando informação','Concluída','Arquivada']),types:countBy(coletaRows.filter(function(row){return row[1];}),2,['Elogio','Sugestão','Crítica','Denúncia']),priorities:countBy(followRows.filter(function(row){return row[0];}),5,['Baixa','Média','Alta','Crítica']),deadlines:countBy(followRows.filter(function(row){return row[0];}),30,['No prazo','Vencido','Encerrado']),cases:cases};
}

/** Endpoint usado pela versão pública hospedada fora do domínio Google. */
function doPost(event) {
  try {
    var raw = event && event.parameter && event.parameter.payload;
    if (!raw) throw new Error('Dados do formulário ausentes.');
    var result = submitManifestacao(JSON.parse(raw));
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ok: false, error: error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Mangabeira na Escuta')
    .addItem('Atualizar organização e dashboard', 'setupMangabeiraNaEscuta')
    .addToUi();
}

function authorizeCanalEscuta() {
  DriveApp.getRootFolder();
  setupMangabeiraNaEscuta();
  getOrCreateCanalFolder_();
}

/** Cria/atualiza toda a estrutura operacional da planilha vinculada. */
function setupMangabeiraNaEscuta() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  spreadsheet.rename(CANAL_CONFIG.SPREADSHEET_NAME);
  spreadsheet.setSpreadsheetTimeZone('America/Sao_Paulo');

  var coleta = ensureSheetWithHeaders_(spreadsheet, CANAL_CONFIG.SHEET_NAME, getCollectionHeaders_(), '#0F5C56');
  var acompanhamento = ensureSheetWithHeaders_(spreadsheet, CANAL_CONFIG.FOLLOWUP_SHEET_NAME, getFollowupHeaders_(), '#8A5D00');
  var listas = setupListsSheet_(spreadsheet);
  setupCollectionPresentation_(coleta);
  setupFollowupValidation_(acompanhamento, listas);
  repairOperationalFormulas_(coleta, acompanhamento);
  setupDashboard_(spreadsheet);
  setupPresentationDashboard_(spreadsheet);

  coleta.setTabColor('#0F5C56');
  acompanhamento.setTabColor('#8A5D00');
  listas.setTabColor('#7A8493');
  return 'Estrutura MANGABEIRA NA ESCUTA criada/atualizada com sucesso.';
}

function setupCollectionPresentation_(sheet) {
  var maxRows = Math.max(sheet.getMaxRows() - 1, 1);
  sheet.setFrozenColumns(4);
  sheet.getRange(2, 1, maxRows, 22).setVerticalAlignment('top');
  sheet.getRange(2, 1, maxRows, 1).setNumberFormat('dd/mm/yyyy hh:mm');
  sheet.getRange(2, 22, maxRows, 1).setNumberFormat('dd/mm/yyyy');
  sheet.getRange(2, 9, maxRows, 12).setWrap(true);
  sheet.setColumnWidth(1, 155); sheet.setColumnWidth(2, 165);
  sheet.setColumnWidths(3, 6, 125); sheet.setColumnWidth(9, 210);
  sheet.setColumnWidth(10, 360); sheet.setColumnWidths(11, 10, 210);
  sheet.setColumnWidth(21, 125); sheet.setColumnWidth(22, 150);
  sheet.getBandings().forEach(function(banding) { banding.remove(); });
  sheet.getRange(1, 1, sheet.getMaxRows(), 22).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
  sheet.getRange(1, 1, 1, 22).setBackground('#0F5C56').setFontColor('#FFFFFF').setFontWeight('bold');
  sheet.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Denúncia').setBackground('#FBEAE6').setFontColor('#C4321C').setBold(true).setRanges([sheet.getRange(2, 3, maxRows, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Sim').setBackground('#FDF3DC').setFontColor('#8A5D00').setBold(true).setRanges([sheet.getRange(2, 18, maxRows, 1)]).build()
  ]);
}

function repairOperationalFormulas_(coleta, acompanhamento) {
  var coletaLastRow = coleta.getLastRow();
  for (var row = 2; row <= coletaLastRow; row++) {
    if (coleta.getRange(row, 2).getValue()) {
      coleta.getRange(row, 22).setFormula('=WORKDAY(INT(A' + row + ');2)');
    }
  }

  var acompanhamentoLastRow = acompanhamento.getLastRow();
  for (var followupRow = 2; followupRow <= acompanhamentoLastRow; followupRow++) {
    if (!acompanhamento.getRange(followupRow, 1).getValue()) continue;
    acompanhamento.getRange(followupRow, 20).setFormula(
      '=IF(OR(R' + followupRow + '="";S' + followupRow + '="");"";VALUE(LEFT(R' + followupRow + ';1))*VALUE(LEFT(S' + followupRow + ';1)))'
    );
    acompanhamento.getRange(followupRow, 30).setFormula(
      '=IF(A' + followupRow + '="";"";IF(AA' + followupRow + '<>"";AA' + followupRow + '-INT(B' + followupRow + ');TODAY()-INT(B' + followupRow + ')))'
    );
    acompanhamento.getRange(followupRow, 31).setFormula(
      '=IF(A' + followupRow + '="";"";IF(OR(E' + followupRow + '="Concluída";E' + followupRow + '="Arquivada");"Encerrado";IF(TODAY()>WORKDAY(INT(B' + followupRow + ');15);"Vencido";"No prazo")))'
    );
    acompanhamento.getRange(followupRow, 32).setFormula('=TODAY()');
  }
}

function canalPad2_(number) {
  number = Number(number);
  return (number < 10 ? '0' : '') + number;
}

function canalCleanText_(value, field, minLength, maxLength, required) {
  var text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!required && !text) return '';
  if (text.length < minLength || text.length > maxLength) {
    throw new Error('Campo inválido: ' + field + '.');
  }
  return text;
}

function getOrCreateCanalSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(CANAL_CONFIG.SHEET_NAME);
  if (!sheet) setupMangabeiraNaEscuta();
  return spreadsheet.getSheetByName(CANAL_CONFIG.SHEET_NAME);
}

function getCollectionHeaders_() {
  return [
    'DATA/HORA DO RECEBIMENTO', 'PROTOCOLO', 'TIPO', 'MODO DE ENVIO', 'NOME', 'SETOR/FUNÇÃO',
    'CONTATO', 'CATEGORIA DA DENÚNCIA', 'ASSUNTO', 'RELATO', 'EM QUE CONTEXTO',
    'ONDE OCORREU', 'QUANDO OCORREU', 'HÁ RECORRÊNCIA', 'PESSOAS ENVOLVIDAS',
    'HÁ TESTEMUNHAS', 'QUEM PODE TESTEMUNHAR', 'URGENTE', 'DESEJA RETORNO',
    'EVIDÊNCIA/ANEXO', 'STATUS INICIAL', 'DATA LIMITE PARA TRIAGEM'
  ];
}

function getFollowupHeaders_() {
  return [
    'PROTOCOLO', 'DATA DO RECEBIMENTO', 'TIPO', 'CATEGORIA', 'STATUS', 'PRIORIDADE',
    'RESPONSÁVEL PELA INVESTIGAÇÃO', 'DATA DE INÍCIO', 'RELATO', 'EM QUE CONTEXTO',
    'ONDE E QUANDO OCORREU', 'HÁ RECORRÊNCIA',
    'ENVOLVE FATORES ORGANIZACIONAIS, RELACIONAIS OU DE GESTÃO',
    'PROCEDIMENTOS REALIZADOS', 'EVIDÊNCIA COLETADA', 'ANÁLISE TÉCNICA',
    'ANÁLISE DO RISCO (DESCRIÇÃO)', 'AVALIAÇÃO DO RISCO (PROBABILIDADE)',
    'AVALIAÇÃO DO RISCO (SEVERIDADE)', 'NÍVEL DE RISCO', 'POSSÍVEIS IMPACTOS À SAÚDE',
    'MEDIDAS DE CONTROLE E PLANO DE AÇÃO', 'DATA PREVISTA PARA REALIZAÇÃO',
    'INDICADORES DE ACOMPANHAMENTO', 'NECESSITA REVISÃO DO PGR', 'DOCUMENTO DIGITALIZADO',
    'DATA DE CONCLUSÃO', 'RESULTADO/CONCLUSÃO', 'RETORNO REALIZADO EM',
    'DIAS EM ABERTO', 'PRAZO', 'ÚLTIMA ATUALIZAÇÃO', 'OBSERVAÇÕES DE GOVERNANÇA'
  ];
}

function ensureSheetWithHeaders_(spreadsheet, name, headers, color) {
  var sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
  if (sheet.getMaxColumns() < headers.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
  }
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground(color).setFontColor('#FFFFFF').setFontWeight('bold')
    .setWrap(true).setVerticalAlignment('middle');
  sheet.setRowHeight(1, 54);
  if (sheet.getFilter()) sheet.getFilter().remove();
  sheet.getRange(1, 1, Math.max(sheet.getMaxRows(), 2), headers.length).createFilter();
  sheet.setHiddenGridlines(true);
  return sheet;
}

function setupListsSheet_(spreadsheet) {
  var sheet = spreadsheet.getSheetByName(CANAL_CONFIG.LISTS_SHEET_NAME) || spreadsheet.insertSheet(CANAL_CONFIG.LISTS_SHEET_NAME);
  var columns = [
    ['STATUS', 'Recebida', 'Em triagem', 'Em investigação', 'Plano de ação', 'Aguardando informação', 'Concluída', 'Arquivada'],
    ['PRIORIDADE', 'Baixa', 'Média', 'Alta', 'Crítica'],
    ['PROBABILIDADE', '1 - Rara', '2 - Improvável', '3 - Possível', '4 - Provável', '5 - Quase certa'],
    ['SEVERIDADE', '1 - Leve', '2 - Moderada', '3 - Significativa', '4 - Grave', '5 - Crítica'],
    ['SIM_NAO', 'Sim', 'Não', 'Não se aplica'],
    ['FATORES', 'Organizacionais', 'Relacionais', 'Gestão', 'Múltiplos fatores', 'Não identificado', 'Não se aplica']
  ];
  sheet.clear();
  columns.forEach(function(values, index) {
    sheet.getRange(1, index + 1, values.length, 1).setValues(values.map(function(value) { return [value]; }));
  });
  sheet.getRange(1, 1, 1, columns.length).setBackground('#56606F').setFontColor('#FFFFFF').setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.setHiddenGridlines(true);
  sheet.autoResizeColumns(1, columns.length);
  return sheet;
}

function setupFollowupValidation_(sheet, lists) {
  var maxRows = Math.max(sheet.getMaxRows() - 1, 1);
  function validation(column, listColumn, count) {
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInRange(lists.getRange(2, listColumn, count, 1), true)
      .setAllowInvalid(false).build();
    sheet.getRange(2, column, maxRows, 1).setDataValidation(rule);
  }
  validation(5, 1, 7); validation(6, 2, 4); validation(13, 6, 6);
  validation(18, 3, 5); validation(19, 4, 5); validation(25, 5, 3);
  sheet.getRange(2, 2, maxRows, 1).setNumberFormat('dd/mm/yyyy hh:mm');
  [8, 23, 27, 29, 32].forEach(function(column) {
    sheet.getRange(2, column, maxRows, 1).setNumberFormat('dd/mm/yyyy');
  });
  sheet.getRange(2, 20, maxRows, 1).setNumberFormat('0');
  sheet.getRange(2, 30, maxRows, 1).setNumberFormat('0');
  sheet.getRange(2, 9, maxRows, 25).setWrap(true).setVerticalAlignment('top');
  sheet.setFrozenColumns(4);
  sheet.setColumnWidth(1, 165); sheet.setColumnWidth(2, 155);
  sheet.setColumnWidths(3, 4, 125); sheet.setColumnWidth(7, 210); sheet.setColumnWidth(8, 125);
  sheet.setColumnWidths(9, 4, 260); sheet.setColumnWidths(13, 8, 220);
  sheet.setColumnWidths(21, 6, 240); sheet.setColumnWidths(27, 7, 155);
  sheet.getBandings().forEach(function(banding) { banding.remove(); });
  sheet.getRange(1, 1, sheet.getMaxRows(), 33).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
  sheet.getRange(1, 1, 1, 33).setBackground('#8A5D00').setFontColor('#FFFFFF').setFontWeight('bold');
  sheet.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Crítica').setBackground('#FBEAE6').setFontColor('#C4321C').setBold(true).setRanges([sheet.getRange(2, 6, maxRows, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Alta').setBackground('#FDF3DC').setFontColor('#8A5D00').setBold(true).setRanges([sheet.getRange(2, 6, maxRows, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Concluída').setBackground('#E7F5EE').setFontColor('#1F7A52').setRanges([sheet.getRange(2, 5, maxRows, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Vencido').setBackground('#FBEAE6').setFontColor('#C4321C').setRanges([sheet.getRange(2, 31, maxRows, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('No prazo').setBackground('#E7F5EE').setFontColor('#1F7A52').setRanges([sheet.getRange(2, 31, maxRows, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThanOrEqualTo(15).setBackground('#FBEAE6').setFontColor('#C4321C').setRanges([sheet.getRange(2, 20, maxRows, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberBetween(8, 14).setBackground('#FDF3DC').setFontColor('#8A5D00').setRanges([sheet.getRange(2, 20, maxRows, 1)]).build()
  ]);
}

function setupDashboard_(spreadsheet) {
  var sheet = spreadsheet.getSheetByName(CANAL_CONFIG.DASHBOARD_SHEET_NAME) || spreadsheet.insertSheet(CANAL_CONFIG.DASHBOARD_SHEET_NAME);
  if (sheet.getMaxColumns() < 12) sheet.insertColumnsAfter(sheet.getMaxColumns(), 12 - sheet.getMaxColumns());
  sheet.setFrozenRows(0);
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).breakApart();
  sheet.clear();
  sheet.getCharts().forEach(function(chart) { sheet.removeChart(chart); });
  sheet.setHiddenGridlines(true).setTabColor('#14766E');
  sheet.setColumnWidths(1, 12, 95);
  sheet.getRange('A1:L2').merge().setValue('MANGABEIRA NA ESCUTA\nPAINEL DE ACOMPANHAMENTO')
    .setBackground('#0F5C56').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(20)
    .setHorizontalAlignment('left').setVerticalAlignment('middle').setWrap(true);
  sheet.setRowHeights(1, 2, 34);
  sheet.getRange('A3:L3').merge().setFormula('="Visão gerencial atualizada em "&TEXT(NOW();"dd/mm/yyyy hh:mm")')
    .setFontColor('#56606F').setFontSize(10).setHorizontalAlignment('right');

  var cards = [
    ['A5:C5', 'A6:C7', 'TOTAL DE MANIFESTAÇÕES', '=COUNTA(\'01_COLETA\'!B2:B)', '#E4F3F1', '#0F5C56'],
    ['D5:F5', 'D6:F7', 'CASOS EM ABERTO', '=COUNTIFS(\'02_ACOMPANHAMENTO\'!A2:A;"<>";\'02_ACOMPANHAMENTO\'!E2:E;"<>Concluída";\'02_ACOMPANHAMENTO\'!E2:E;"<>Arquivada")', '#E4F3F1', '#0F5C56'],
    ['G5:I5', 'G6:I7', 'PRIORIDADE CRÍTICA', '=COUNTIF(\'02_ACOMPANHAMENTO\'!F2:F;"Crítica")', '#FDF3DC', '#8A5D00'],
    ['J5:L5', 'J6:L7', 'FORA DO PRAZO', '=COUNTIF(\'02_ACOMPANHAMENTO\'!AE2:AE;"Vencido")', '#FBEAE6', '#C4321C']
  ];
  cards.forEach(function(card) {
    sheet.getRange(card[0]).merge().setValue(card[2]).setBackground(card[4]).setFontColor(card[5]).setFontWeight('bold').setHorizontalAlignment('center');
    sheet.getRange(card[1]).merge().setFormula(card[3]).setBackground(card[4]).setFontColor(card[5]).setFontSize(26).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  });
  sheet.setRowHeights(5, 3, 30);

  sheet.getRange('A10:B18').setValues([
    ['STATUS', 'QUANTIDADE'], ['Recebida', '=COUNTIF(\'02_ACOMPANHAMENTO\'!E:E;A11)'], ['Em triagem', '=COUNTIF(\'02_ACOMPANHAMENTO\'!E:E;A12)'],
    ['Em investigação', '=COUNTIF(\'02_ACOMPANHAMENTO\'!E:E;A13)'], ['Plano de ação', '=COUNTIF(\'02_ACOMPANHAMENTO\'!E:E;A14)'],
    ['Aguardando informação', '=COUNTIF(\'02_ACOMPANHAMENTO\'!E:E;A15)'], ['Concluída', '=COUNTIF(\'02_ACOMPANHAMENTO\'!E:E;A16)'],
    ['Arquivada', '=COUNTIF(\'02_ACOMPANHAMENTO\'!E:E;A17)'], ['TOTAL', '=SUM(B11:B17)']
  ]);
  sheet.getRange('D10:E14').setValues([
    ['TIPO', 'QUANTIDADE'], ['Elogio', '=COUNTIF(\'01_COLETA\'!C:C;D11)'], ['Sugestão', '=COUNTIF(\'01_COLETA\'!C:C;D12)'],
    ['Crítica', '=COUNTIF(\'01_COLETA\'!C:C;D13)'], ['Denúncia', '=COUNTIF(\'01_COLETA\'!C:C;D14)']
  ]);
  sheet.getRange('G10:H14').setValues([
    ['PRIORIDADE', 'QUANTIDADE'], ['Baixa', '=COUNTIF(\'02_ACOMPANHAMENTO\'!F:F;G11)'], ['Média', '=COUNTIF(\'02_ACOMPANHAMENTO\'!F:F;G12)'],
    ['Alta', '=COUNTIF(\'02_ACOMPANHAMENTO\'!F:F;G13)'], ['Crítica', '=COUNTIF(\'02_ACOMPANHAMENTO\'!F:F;G14)']
  ]);
  sheet.getRange('J10:K13').setValues([
    ['PRAZO', 'QUANTIDADE'], ['No prazo', '=COUNTIF(\'02_ACOMPANHAMENTO\'!AE:AE;J11)'],
    ['Vencido', '=COUNTIF(\'02_ACOMPANHAMENTO\'!AE:AE;J12)'], ['Encerrado', '=COUNTIF(\'02_ACOMPANHAMENTO\'!AE:AE;J13)']
  ]);
  ['A10:B10', 'D10:E10', 'G10:H10', 'J10:K10'].forEach(function(range) {
    sheet.getRange(range).setBackground('#56606F').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center');
  });
  ['A11:B18', 'D11:E14', 'G11:H14', 'J11:K13'].forEach(function(range) {
    sheet.getRange(range).setBackground('#F7F9FB').setBorder(true, true, true, true, true, true, '#DCE2EA', SpreadsheetApp.BorderStyle.SOLID);
  });

  var chartOptions = {backgroundColor: '#FFFFFF', fontName: 'Arial', titleTextStyle: {color: '#171F2E', fontSize: 15, bold: true}};
  var statusChart = sheet.newChart().asBarChart().addRange(sheet.getRange('A10:B17')).setPosition(20, 1, 0, 0)
    .setOption('title', 'Casos por status').setOption('legend', {position: 'none'}).setOption('colors', ['#14766E']).setOption('backgroundColor', chartOptions.backgroundColor).build();
  var typeChart = sheet.newChart().asPieChart().addRange(sheet.getRange('D10:E14')).setPosition(20, 7, 0, 0)
    .setOption('title', 'Manifestações por tipo').setOption('pieHole', 0.5).setOption('colors', ['#1F7A52', '#14766E', '#8A5D00', '#C4321C']).setOption('backgroundColor', '#FFFFFF').build();
  var priorityChart = sheet.newChart().asColumnChart().addRange(sheet.getRange('G10:H14')).setPosition(36, 1, 0, 0)
    .setOption('title', 'Casos por prioridade').setOption('legend', {position: 'none'}).setOption('colors', ['#8A5D00']).setOption('backgroundColor', '#FFFFFF').build();
  var deadlineChart = sheet.newChart().asPieChart().addRange(sheet.getRange('J10:K13')).setPosition(36, 7, 0, 0)
    .setOption('title', 'Situação dos prazos').setOption('pieHole', 0.5).setOption('colors', ['#1F7A52', '#C4321C', '#56606F']).setOption('backgroundColor', '#FFFFFF').build();
  [statusChart, typeChart, priorityChart, deadlineChart].forEach(function(chart) { sheet.insertChart(chart); });

  sheet.getRange('A60:L60').merge().setValue('CASOS QUE EXIGEM ATENÇÃO')
    .setBackground('#8A5D00').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(13);
  sheet.getRange('A61:F61').setValues([['PROTOCOLO', 'STATUS', 'PRIORIDADE', 'RESPONSÁVEL', 'DIAS EM ABERTO', 'PRAZO']])
    .setBackground('#56606F').setFontColor('#FFFFFF').setFontWeight('bold');
  sheet.getRange('A62').setFormula('=IFERROR(QUERY(\'02_ACOMPANHAMENTO\'!A2:AE;"select A,E,F,G,AD,AE where A is not null and E <> \'Concluída\' and E <> \'Arquivada\' order by AD desc limit 10";0);"Sem casos em aberto")');
  sheet.getRange('A62:F72').setWrap(true).setVerticalAlignment('middle');
  sheet.getRange('A61:F72').setBorder(true, true, true, true, true, true, '#DCE2EA', SpreadsheetApp.BorderStyle.SOLID);
  sheet.setColumnWidth(1, 150); sheet.setColumnWidth(4, 150); sheet.setColumnWidth(5, 110); sheet.setColumnWidth(6, 110);
  sheet.setFrozenRows(3);
}

function setupPresentationDashboard_(spreadsheet) {
  var sheet = spreadsheet.getSheetByName(CANAL_CONFIG.PRESENTATION_SHEET_NAME) || spreadsheet.insertSheet(CANAL_CONFIG.PRESENTATION_SHEET_NAME);
  if (sheet.getMaxColumns() < 16) sheet.insertColumnsAfter(sheet.getMaxColumns(), 16 - sheet.getMaxColumns());
  sheet.setFrozenRows(0);
  sheet.showRows(1, sheet.getMaxRows());
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).breakApart();
  sheet.clear();
  sheet.getCharts().forEach(function(chart) { sheet.removeChart(chart); });
  sheet.setHiddenGridlines(true).setTabColor('#0F5C56');
  sheet.setColumnWidths(1, 16, 80);

  sheet.getRange('A1:P2').merge().setValue('MANGABEIRA NA ESCUTA  |  VISÃO EXECUTIVA')
    .setBackground('#0F5C56').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(22)
    .setHorizontalAlignment('left').setVerticalAlignment('middle');
  sheet.getRange('A3:P3').merge().setFormula('="Apresentação gerencial • Atualização automática em "&TEXT(NOW();"dd/mm/yyyy hh:mm")')
    .setBackground('#E4F3F1').setFontColor('#0F5C56').setFontWeight('bold').setHorizontalAlignment('right');
  sheet.setRowHeights(1, 2, 34); sheet.setRowHeight(3, 26);

  var cards = [
    ['A5:D5', 'A6:D8', 'MANIFESTAÇÕES RECEBIDAS', '=COUNTA(\'01_COLETA\'!B2:B)', '#E4F3F1', '#0F5C56'],
    ['E5:H5', 'E6:H8', 'CASOS EM ABERTO', '=COUNTIFS(\'02_ACOMPANHAMENTO\'!A2:A;"<>";\'02_ACOMPANHAMENTO\'!E2:E;"<>Concluída";\'02_ACOMPANHAMENTO\'!E2:E;"<>Arquivada")', '#E4F3F1', '#0F5C56'],
    ['I5:L5', 'I6:L8', 'CASOS CRÍTICOS', '=COUNTIF(\'02_ACOMPANHAMENTO\'!F2:F;"Crítica")', '#FDF3DC', '#8A5D00'],
    ['M5:P5', 'M6:P8', 'FORA DO PRAZO', '=COUNTIF(\'02_ACOMPANHAMENTO\'!AE2:AE;"Vencido")', '#FBEAE6', '#C4321C']
  ];
  cards.forEach(function(card) {
    sheet.getRange(card[0]).merge().setValue(card[2]).setBackground(card[4]).setFontColor(card[5])
      .setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
    sheet.getRange(card[1]).merge().setFormula(card[3]).setBackground(card[4]).setFontColor(card[5])
      .setFontSize(30).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  });
  sheet.setRowHeights(5, 4, 30);
  sheet.getRange('A10:P10').merge().setValue('PANORAMA DO CANAL')
    .setBackground('#56606F').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(13);
  sheet.getRange('A70:B78').setValues([
    ['STATUS', 'QUANTIDADE'], ['Recebida', '=COUNTIF(\'02_ACOMPANHAMENTO\'!E:E;A71)'], ['Em triagem', '=COUNTIF(\'02_ACOMPANHAMENTO\'!E:E;A72)'],
    ['Em investigação', '=COUNTIF(\'02_ACOMPANHAMENTO\'!E:E;A73)'], ['Plano de ação', '=COUNTIF(\'02_ACOMPANHAMENTO\'!E:E;A74)'],
    ['Aguardando informação', '=COUNTIF(\'02_ACOMPANHAMENTO\'!E:E;A75)'], ['Concluída', '=COUNTIF(\'02_ACOMPANHAMENTO\'!E:E;A76)'],
    ['Arquivada', '=COUNTIF(\'02_ACOMPANHAMENTO\'!E:E;A77)'], ['TOTAL', '=SUM(B71:B77)']
  ]);
  sheet.getRange('D70:E74').setValues([
    ['TIPO', 'QUANTIDADE'], ['Elogio', '=COUNTIF(\'01_COLETA\'!C:C;D71)'], ['Sugestão', '=COUNTIF(\'01_COLETA\'!C:C;D72)'],
    ['Crítica', '=COUNTIF(\'01_COLETA\'!C:C;D73)'], ['Denúncia', '=COUNTIF(\'01_COLETA\'!C:C;D74)']
  ]);
  sheet.getRange('G70:H74').setValues([
    ['PRIORIDADE', 'QUANTIDADE'], ['Baixa', '=COUNTIF(\'02_ACOMPANHAMENTO\'!F:F;G71)'], ['Média', '=COUNTIF(\'02_ACOMPANHAMENTO\'!F:F;G72)'],
    ['Alta', '=COUNTIF(\'02_ACOMPANHAMENTO\'!F:F;G73)'], ['Crítica', '=COUNTIF(\'02_ACOMPANHAMENTO\'!F:F;G74)']
  ]);
  sheet.getRange('J70:K73').setValues([
    ['PRAZO', 'QUANTIDADE'], ['No prazo', '=COUNTIF(\'02_ACOMPANHAMENTO\'!AE:AE;J71)'],
    ['Vencido', '=COUNTIF(\'02_ACOMPANHAMENTO\'!AE:AE;J72)'], ['Encerrado', '=COUNTIF(\'02_ACOMPANHAMENTO\'!AE:AE;J73)']
  ]);
  var statusChart = sheet.newChart().asBarChart().addRange(sheet.getRange('A70:B77')).setPosition(12, 1, 0, 0)
    .setOption('title', 'Distribuição dos casos por status').setOption('legend', {position: 'none'}).setOption('colors', ['#14766E'])
    .setOption('backgroundColor', '#FFFFFF').setOption('width', 610).setOption('height', 310).build();
  var typeChart = sheet.newChart().asPieChart().addRange(sheet.getRange('D70:E74')).setPosition(12, 9, 0, 0)
    .setOption('title', 'Composição das manifestações').setOption('pieHole', 0.52)
    .setOption('colors', ['#1F7A52', '#14766E', '#8A5D00', '#C4321C']).setOption('backgroundColor', '#FFFFFF')
    .setOption('width', 610).setOption('height', 310).build();
  var priorityChart = sheet.newChart().asColumnChart().addRange(sheet.getRange('G70:H74')).setPosition(29, 1, 0, 0)
    .setOption('title', 'Casos por prioridade').setOption('legend', {position: 'none'}).setOption('colors', ['#8A5D00'])
    .setOption('backgroundColor', '#FFFFFF').setOption('width', 610).setOption('height', 310).build();
  var deadlineChart = sheet.newChart().asPieChart().addRange(sheet.getRange('J70:K73')).setPosition(29, 9, 0, 0)
    .setOption('title', 'Cumprimento dos prazos').setOption('pieHole', 0.52)
    .setOption('colors', ['#1F7A52', '#C4321C', '#56606F']).setOption('backgroundColor', '#FFFFFF')
    .setOption('width', 610).setOption('height', 310).build();
  [statusChart, typeChart, priorityChart, deadlineChart].forEach(function(chart) { sheet.insertChart(chart); });
  sheet.getRange('A47:P47').merge().setValue('LEITURA EXECUTIVA')
    .setBackground('#0F5C56').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(13);
  sheet.getRange('A49:F52').merge().setFormula('="DENÚNCIAS\n"&COUNTIF(\'01_COLETA\'!C:C;"Denúncia")&" registro(s) — "&TEXT(IFERROR(COUNTIF(\'01_COLETA\'!C:C;"Denúncia")/COUNTA(\'01_COLETA\'!B2:B);0);"0%")&" do total"')
    .setBackground('#FBEAE6').setFontColor('#C4321C').setFontWeight('bold').setFontSize(14).setWrap(true).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.getRange('G49:K52').merge().setFormula('="PRAZO\n"&COUNTIF(\'02_ACOMPANHAMENTO\'!AE:AE;"No prazo")&" caso(s) em dia e "&COUNTIF(\'02_ACOMPANHAMENTO\'!AE:AE;"Vencido")&" vencido(s)"')
    .setBackground('#E7F5EE').setFontColor('#1F7A52').setFontWeight('bold').setFontSize(14).setWrap(true).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.getRange('L49:P52').merge().setFormula('="CONCLUSÃO\n"&COUNTIF(\'02_ACOMPANHAMENTO\'!E:E;"Concluída")&" caso(s) concluído(s) • média de "&ROUND(IFERROR(AVERAGE(FILTER(\'02_ACOMPANHAMENTO\'!AD2:AD;\'02_ACOMPANHAMENTO\'!E2:E="Concluída"));0);0)&" dia(s)"')
    .setBackground('#E4F3F1').setFontColor('#0F5C56').setFontWeight('bold').setFontSize(14).setWrap(true).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeights(49, 4, 28);
  sheet.getRange('A55:P55').merge().setValue('Fonte: registros do formulário e acompanhamento das investigações • Uso interno e confidencial')
    .setFontColor('#56606F').setFontSize(9).setHorizontalAlignment('center');
  sheet.setFrozenRows(3);
}

function getOrCreateCanalFolder_() {
  var folders = DriveApp.getFoldersByName(CANAL_CONFIG.DRIVE_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(CANAL_CONFIG.DRIVE_FOLDER_NAME);
}

function decodeCanalFile_(payload) {
  if (CANAL_CONFIG.ALLOWED_MIME_TYPES.indexOf(payload.fileMimeType) === -1) {
    throw new Error('Formato de anexo inválido. Envie PDF, JPG ou PNG.');
  }
  var bytes;
  try {
    bytes = Utilities.base64Decode(payload.fileBase64);
  } catch (error) {
    throw new Error('Não foi possível ler o anexo enviado.');
  }
  if (!bytes.length || bytes.length > CANAL_CONFIG.MAX_FILE_BYTES) {
    throw new Error('O anexo deve ter no máximo 8 MB.');
  }
  return bytes;
}

function createCanalProtocol_() {
  var year = new Date().getFullYear();
  return CANAL_CONFIG.PROTOCOL_PREFIX + year + '-' + Utilities.getUuid().split('-')[0].toUpperCase();
}

function submitManifestacao(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Dados do formulário ausentes.');

  var tipo = canalCleanText_(payload.tipo, 'tipo de manifestação', 3, 20, true);
  if (CANAL_TIPOS.indexOf(tipo) === -1) throw new Error('Tipo de manifestação inválido.');

  var identificado = !!payload.identificado;
  var assunto = canalCleanText_(payload.assunto, 'assunto', 3, 150, true);
  var descricao = canalCleanText_(payload.descricao, 'descrição', 10, 4000, true);
  var local = canalCleanText_(payload.local, 'local/setor relacionado', 0, 150, false);
  var dataOcorrido = canalCleanText_(payload.dataOcorrido, 'data aproximada', 0, 40, false);
  var contexto = canalCleanText_(payload.contexto, 'contexto', 0, 1000, false);
  var recorrencia = canalCleanText_(payload.recorrencia, 'recorrência', 0, 40, false);
  var urgente = payload.urgente ? 'Sim' : 'Não';
  var desejaRetorno = payload.desejaRetorno ? 'Sim' : 'Não';

  var categoriaDenuncia = '';
  var envolvidos = '';
  var testemunhas = 'Não';
  var testemunhasDetalhes = '';
  if (tipo === 'Denúncia') {
    categoriaDenuncia = canalCleanText_(payload.categoriaDenuncia, 'categoria da denúncia', 3, 120, true);
    if (CANAL_CATEGORIAS_DENUNCIA.indexOf(categoriaDenuncia) === -1) {
      throw new Error('Categoria de denúncia inválida.');
    }
    envolvidos = canalCleanText_(payload.envolvidos, 'pessoas envolvidas', 0, 300, false);
    testemunhas = payload.testemunhas ? 'Sim' : 'Não';
    testemunhasDetalhes = canalCleanText_(payload.testemunhasDetalhes, 'identificação das testemunhas', 0, 300, false);
  }

  var nome = '';
  var setorFuncao = '';
  var contato = '';
  if (identificado) {
    nome = canalCleanText_(payload.nome, 'nome completo', 3, 150, true);
    setorFuncao = canalCleanText_(payload.setorFuncao, 'setor/função', 2, 150, false);
    contato = canalCleanText_(payload.contato, 'contato', 0, 150, false);
    if (desejaRetorno === 'Sim' && !contato) {
      throw new Error('Informe um telefone ou e-mail para que possamos retornar.');
    }
  }

  var anexoUrl = '';
  var anexoBlob = null;
  var anexoNome = '';
  if (payload.fileBase64 && payload.fileName && payload.fileMimeType) {
    var bytes = decodeCanalFile_(payload);
    anexoNome = canalCleanText_(payload.fileName, 'nome do arquivo', 1, 180, true).replace(/[\\/:*?"<>|]/g, '_');
    anexoBlob = Utilities.newBlob(bytes, payload.fileMimeType, anexoNome);
  }

  var requestedProtocol = canalCleanText_(payload.protocol, 'protocolo', 0, 30, false);
  var protocol = /^ME-\d{4}-[A-Z0-9]{8}$/.test(requestedProtocol) ? requestedProtocol : createCanalProtocol_();
  var sheet = getOrCreateCanalSheet_();
  var timestamp = new Date();
  var displayTimestamp = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');

  var file = null;
  if (anexoBlob) {
    var folder = getOrCreateCanalFolder_();
    file = folder.createFile(anexoBlob.setName(protocol + ' - ' + anexoNome));
    anexoUrl = file.getUrl();
  }

  var row = [
    timestamp, protocol, tipo, identificado ? 'Identificado' : 'Anônimo',
    nome, setorFuncao, contato, categoriaDenuncia, assunto, descricao, contexto, local,
    dataOcorrido, recorrencia, envolvidos, testemunhas, testemunhasDetalhes, urgente,
    desejaRetorno, anexoUrl, 'Recebida', '=WORKDAY(INT(A' + (sheet.getLastRow() + 1) + ');2)'
  ];

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    sheet.appendRow(row);
    appendFollowupRow_({
      protocol: protocol, timestamp: timestamp, tipo: tipo, categoria: categoriaDenuncia,
      descricao: descricao, contexto: contexto, local: local, dataOcorrido: dataOcorrido,
      recorrencia: recorrencia, urgente: urgente
    });
  } catch (error) {
    if (file) file.setTrashed(true);
    throw new Error('Não foi possível registrar a manifestação. Tente novamente.');
  } finally {
    lock.releaseLock();
  }

  sendCanalEmail_({
    protocol: protocol,
    tipo: tipo,
    identificado: identificado,
    nome: nome,
    setorFuncao: setorFuncao,
    contato: contato,
    assunto: assunto,
    descricao: descricao,
    local: local,
    dataOcorrido: dataOcorrido,
    contexto: contexto,
    recorrencia: recorrencia,
    categoriaDenuncia: categoriaDenuncia,
    envolvidos: envolvidos,
    testemunhas: testemunhas,
    testemunhasDetalhes: testemunhasDetalhes,
    urgente: urgente,
    desejaRetorno: desejaRetorno,
    anexoBlob: anexoBlob,
    timestamp: displayTimestamp
  });

  return {ok: true, protocolo: protocol, submittedAt: new Date().toISOString()};
}

function appendFollowupRow_(data) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(CANAL_CONFIG.FOLLOWUP_SHEET_NAME);
  if (!sheet) {
    setupMangabeiraNaEscuta();
    sheet = spreadsheet.getSheetByName(CANAL_CONFIG.FOLLOWUP_SHEET_NAME);
  }
  var targetRow = sheet.getLastRow() + 1;
  var row = new Array(getFollowupHeaders_().length).fill('');
  row[0] = data.protocol; row[1] = data.timestamp; row[2] = data.tipo; row[3] = data.categoria;
  row[4] = 'Recebida'; row[5] = data.urgente === 'Sim' ? 'Crítica' : 'Média';
  row[8] = data.descricao; row[9] = data.contexto;
  row[10] = [data.local, data.dataOcorrido].filter(String).join(' — '); row[11] = data.recorrencia;
  row[19] = '=IF(OR(R' + targetRow + '="";S' + targetRow + '="");"";VALUE(LEFT(R' + targetRow + ';1))*VALUE(LEFT(S' + targetRow + ';1)))';
  row[29] = '=IF(A' + targetRow + '="";"";IF(AA' + targetRow + '<>"";AA' + targetRow + '-INT(B' + targetRow + ');TODAY()-INT(B' + targetRow + ')))';
  row[30] = '=IF(A' + targetRow + '="";"";IF(OR(E' + targetRow + '="Concluída";E' + targetRow + '="Arquivada");"Encerrado";IF(TODAY()>WORKDAY(INT(B' + targetRow + ');15);"Vencido";"No prazo")))';
  row[31] = '=TODAY()';
  sheet.appendRow(row);
}

function gerarComprovantePdf(html, fileName) {
  if (!html || typeof html !== 'string') throw new Error('Conteúdo do comprovante ausente.');
  var safeName = String(fileName || 'comprovante').replace(/[\\/:*?"<>|]/g, '_');
  var htmlBlob = Utilities.newBlob(html, MimeType.HTML, safeName + '.html');
  var pdfBlob = htmlBlob.getAs(MimeType.PDF).setName(safeName + '.pdf');
  return {
    base64: Utilities.base64Encode(pdfBlob.getBytes()),
    fileName: pdfBlob.getName()
  };
}

function sendCanalEmail_(data) {
  var subject = '[Mangabeira na Escuta] Nova manifestação - ' + data.tipo;
  var lines = [
    'Protocolo: ' + data.protocol,
    'Data/Hora: ' + data.timestamp,
    'Tipo: ' + data.tipo,
    'Modo de envio: ' + (data.identificado ? 'Identificado' : 'Anônimo'),
    ''
  ];
  if (data.identificado) {
    lines.push('Nome: ' + (data.nome || '-'));
    lines.push('Setor/Função: ' + (data.setorFuncao || '-'));
    lines.push('Contato: ' + (data.contato || '-'));
    lines.push('');
  }
  if (data.tipo === 'Denúncia') {
    lines.push('Categoria: ' + data.categoriaDenuncia);
  }
  lines.push('Assunto: ' + data.assunto);
  lines.push('Local/Setor relacionado: ' + (data.local || '-'));
  lines.push('Data aproximada do ocorrido: ' + (data.dataOcorrido || '-'));
  lines.push('Contexto: ' + (data.contexto || '-'));
  lines.push('Há recorrência: ' + (data.recorrencia || '-'));
  if (data.tipo === 'Denúncia') {
    lines.push('Pessoas envolvidas: ' + (data.envolvidos || '-'));
    lines.push('Há testemunhas: ' + data.testemunhas);
    lines.push('Quem pode testemunhar: ' + (data.testemunhasDetalhes || '-'));
  }
  lines.push('Urgente: ' + data.urgente);
  lines.push('Deseja retorno: ' + data.desejaRetorno);
  lines.push('');
  lines.push('Descrição:');
  lines.push(data.descricao);
  lines.push('');
  if (data.tipo === 'Denúncia') {
    lines.push('Esta denúncia é tratada conforme a NR-1 (gestão de riscos psicossociais), a CLT e a Lei nº 14.457/2022 (Comitês de Prevenção ao Assédio), além do POP-01 - Ouvidoria/Canal de Escuta. Não há retaliação para denúncias feitas de boa-fé.');
  } else {
    lines.push('Este é um canal confidencial. Trate esta manifestação conforme o POP-01 - Ouvidoria/Canal de Escuta (confirmação em até 48h, resposta final em até 15 dias úteis).');
  }

  var options = {};
  if (data.anexoBlob) options.attachments = [data.anexoBlob];

  MailApp.sendEmail(CANAL_CONFIG.DEST_EMAIL, subject, lines.join('\n'), options);
}
