/**
 * Mangabeira na Escuta - Canal de Escuta / Ouvidoria (Google Apps Script)
 * Segue o POP-01 - Ouvidoria e Canal de Escuta do Mangabeira Shopping.
 * Script vinculado a uma planilha nova (container-bound): use a planilha
 * ativa como destino dos registros, sem precisar fixar um ID.
 */

var CANAL_CONFIG = {
  SHEET_NAME: 'Manifestacoes',
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

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Mangabeira na Escuta')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function authorizeCanalEscuta() {
  DriveApp.getRootFolder();
  getOrCreateCanalSheet_();
  getOrCreateCanalFolder_();
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
  if (sheet) return sheet;

  sheet = spreadsheet.insertSheet(CANAL_CONFIG.SHEET_NAME);
  sheet.appendRow([
    'Data/Hora', 'Protocolo', 'Tipo', 'Modo de envio', 'Nome', 'Setor/Função',
    'Contato', 'Categoria (Denúncia)', 'Assunto', 'Descrição', 'Local/Setor relacionado',
    'Data aproximada', 'Pessoas envolvidas', 'Há testemunhas?', 'Urgente?',
    'Deseja retorno?', 'Anexo'
  ]);
  sheet.setFrozenRows(1);
  return sheet;
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
  var urgente = payload.urgente ? 'Sim' : 'Não';
  var desejaRetorno = payload.desejaRetorno ? 'Sim' : 'Não';

  var categoriaDenuncia = '';
  var envolvidos = '';
  var testemunhas = 'Não';
  if (tipo === 'Denúncia') {
    categoriaDenuncia = canalCleanText_(payload.categoriaDenuncia, 'categoria da denúncia', 3, 120, true);
    if (CANAL_CATEGORIAS_DENUNCIA.indexOf(categoriaDenuncia) === -1) {
      throw new Error('Categoria de denúncia inválida.');
    }
    envolvidos = canalCleanText_(payload.envolvidos, 'pessoas envolvidas', 0, 300, false);
    testemunhas = payload.testemunhas ? 'Sim' : 'Não';
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

  var protocol = createCanalProtocol_();
  var sheet = getOrCreateCanalSheet_();
  var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');

  var file = null;
  if (anexoBlob) {
    var folder = getOrCreateCanalFolder_();
    file = folder.createFile(anexoBlob.setName(protocol + ' - ' + anexoNome));
    anexoUrl = file.getUrl();
  }

  var row = [
    timestamp, protocol, tipo, identificado ? 'Identificado' : 'Anônimo',
    nome, setorFuncao, contato, categoriaDenuncia, assunto, descricao, local,
    dataOcorrido, envolvidos, testemunhas, urgente, desejaRetorno, anexoUrl
  ];

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    sheet.appendRow(row);
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
    categoriaDenuncia: categoriaDenuncia,
    envolvidos: envolvidos,
    testemunhas: testemunhas,
    urgente: urgente,
    desejaRetorno: desejaRetorno,
    anexoBlob: anexoBlob,
    timestamp: timestamp
  });

  return {ok: true, protocolo: protocol, submittedAt: new Date().toISOString()};
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
  if (data.tipo === 'Denúncia') {
    lines.push('Pessoas envolvidas: ' + (data.envolvidos || '-'));
    lines.push('Há testemunhas: ' + data.testemunhas);
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
