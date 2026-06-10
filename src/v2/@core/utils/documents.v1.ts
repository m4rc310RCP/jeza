/* =========================================================
 * CPF/CNPJ Utilities
 * Functional + Pure TypeScript
 * Compatível com:
 * - CPF
 * - CNPJ numérico
 * - CNPJ alfanumérico (IN RFB 2.229/2024)
 * =======================================================*/

const CPF_LENGTH = 11;

const CNPJ_LENGTH = 14;

const CNPJ_BASE_LENGTH = 12;

const REGEX_ONLY_NUMBERS = /^\d+$/;

const REGEX_CPF = /^\d{11}$/;

const REGEX_CNPJ = /^([A-Z\d]){12}(\d){2}$/;

const REGEX_REPEATED = /^([A-Z\d])\1+$/;

const REGEX_MASK = /[./-]/g;

const REGEX_INVALID_CHARS = /[^A-Z\d./-]/gi;

const CNPJ_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

/* =========================================================
 * SANITIZE
 * =======================================================*/

export const sanitizeDocument = (value: string) => {
  return value
    .toUpperCase()
    .replace(REGEX_INVALID_CHARS, "")
    .replace(REGEX_MASK, "");
};

/* =========================================================
 * TYPE
 * =======================================================*/

export const getDocumentType = (value: string) => {
  const clean = sanitizeDocument(value);

  if (clean.length <= CPF_LENGTH && REGEX_ONLY_NUMBERS.test(clean)) {
    return "CPF";
  }

  return "CNPJ";
};

export const isCPF = (value: string) => {
  return getDocumentType(value) === "CPF";
};

export const isCNPJ = (value: string) => {
  return getDocumentType(value) === "CNPJ";
};

/* =========================================================
 * FORMAT
 * =======================================================*/

export const formatCPF = (value: string) => {
  const clean = sanitizeDocument(value).slice(0, CPF_LENGTH);

  return clean
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
};

export const formatCNPJ = (value: string) => {
  const clean = sanitizeDocument(value).slice(0, CNPJ_LENGTH);

  return clean
    .replace(/^([A-Z\d]{2})([A-Z\d])/, "$1.$2")
    .replace(/^([A-Z\d]{2})\.([A-Z\d]{3})([A-Z\d])/, "$1.$2.$3")
    .replace(/\.([A-Z\d]{3})([A-Z\d])/, ".$1/$2")
    .replace(/([A-Z\d]{4})([A-Z\d]{1,2})$/, "$1-$2");
};

export const formatDocument = (value: string) => {
  return isCPF(value) ? formatCPF(value) : formatCNPJ(value);
};

/* =========================================================
 * CPF VALIDATION
 * =======================================================*/

export const isValidCPF = (value: string) => {
  const cpf = sanitizeDocument(value);

  if (!REGEX_CPF.test(cpf)) {
    return false;
  }

  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += Number(cpf[i]) * (10 - i);
  }

  let dv1 = (sum * 10) % 11;

  if (dv1 === 10) {
    dv1 = 0;
  }

  if (dv1 !== Number(cpf[9])) {
    return false;
  }

  sum = 0;

  for (let i = 0; i < 10; i++) {
    sum += Number(cpf[i]) * (11 - i);
  }

  let dv2 = (sum * 10) % 11;

  if (dv2 === 10) {
    dv2 = 0;
  }

  return dv2 === Number(cpf[10]);
};

/* =========================================================
 * CNPJ ALFANUMÉRICO
 * =======================================================*/

export const charToValue = (char: string) => {
  const code = char.toUpperCase().charCodeAt(0);

  // 0-9
  if (code >= 48 && code <= 57) {
    return code - 48;
  }

  // A-Z
  return code - 55;
};

export const calculateCNPJDV = (base: string) => {
  let sumDV1 = 0;

  let sumDV2 = 0;

  for (let i = 0; i < CNPJ_BASE_LENGTH; i++) {
    const value = charToValue(base[i]);

    sumDV1 += value * CNPJ_WEIGHTS[i + 1];

    sumDV2 += value * CNPJ_WEIGHTS[i];
  }

  const dv1 = sumDV1 % 11 < 2 ? 0 : 11 - (sumDV1 % 11);

  sumDV2 += dv1 * CNPJ_WEIGHTS[12];

  const dv2 = sumDV2 % 11 < 2 ? 0 : 11 - (sumDV2 % 11);

  return `${dv1}${dv2}`;
};

export const isValidCNPJ = (value: string) => {
  const cnpj = sanitizeDocument(value);

  if (!REGEX_CNPJ.test(cnpj)) {
    return false;
  }

  if (REGEX_REPEATED.test(cnpj)) {
    return false;
  }

  const base = cnpj.slice(0, 12);

  const dv = cnpj.slice(12);

  return calculateCNPJDV(base) === dv;
};

/* =========================================================
 * GENERIC VALIDATION
 * =======================================================*/

export const isValidDocument = (value: string) => {
  return isCPF(value) ? isValidCPF(value) : isValidCNPJ(value);
};

export const maskDocument = (document: string) => {
  const sanitized = sanitizeDocument(document);
  if (isCPF(document)) {
    return `${sanitized.slice(0, 3)}.***.${sanitized.slice(6, 9)}-${sanitized.slice(9)}`;
  }
  return `${sanitized.slice(0, 2)}.***.***/${sanitized.slice(8, 12)}-${sanitized.slice(12)}`;
};
