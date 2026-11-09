import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

/**
 * Valida um payload contra um JSON Schema e retorna a lista de erros legível.
 * @returns {{ valid: boolean, errors: string }}
 */
export const validateSchema = (schema, data) => {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  return { valid, errors: ajv.errorsText(validate.errors, { separator: '\n' }) };
};
