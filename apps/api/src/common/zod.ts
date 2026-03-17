import { BadRequestException } from '@nestjs/common';
import { z, ZodError } from 'zod';

type ValidationIssue = {
  path: string;
  message: string;
  code: string;
};

type ValidationErrorResponse = {
  message: 'Validation failed';
  issues: ValidationIssue[];
};

function formatZodIssuePath(path: PropertyKey[]): string {
  if (path.length === 0) {
    return 'root';
  }

  return path
    .map((segment) =>
      typeof segment === 'number' ? `[${segment}]` : String(segment),
    )
    .join('.')
    .replace('.[', '[');
}

function toValidationErrorResponse(error: ZodError): ValidationErrorResponse {
  return {
    message: 'Validation failed',
    issues: error.issues.map((issue) => ({
      path: formatZodIssuePath(issue.path),
      message: issue.message,
      code: issue.code,
    })),
  };
}

export function parseWithZod<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
): z.output<TSchema> {
  try {
    return schema.parse(input);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      throw new BadRequestException(toValidationErrorResponse(error));
    }

    throw error;
  }
}
