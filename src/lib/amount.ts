export const STELLAR_DECIMALS = 7;
export const STELLAR_SCALE = BigInt(10) ** BigInt(STELLAR_DECIMALS);

const DECIMAL_PATTERN = /^(\d+)(?:\.(\d{1,7})?)?$/;

function addThousandsSeparators(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function sanitizeStellarAmountInput(input: string): string {
  return input.replace(/[\s,_]/g, '').trim();
}

export function parseStellarAmount(input: string): bigint {
  const trimmed = sanitizeStellarAmountInput(input);
  const match = DECIMAL_PATTERN.exec(trimmed);
  if (!match) {
    throw new Error('Enter a valid amount with up to 7 decimal places.');
  }

  const whole = BigInt(match[1]);
  const fraction = (match[2] ?? '').padEnd(STELLAR_DECIMALS, '0');
  return whole * STELLAR_SCALE + BigInt(fraction);
}

export function isPositiveStellarAmount(input: string): boolean {
  try {
    return parseStellarAmount(input) > BigInt(0);
  } catch {
    return false;
  }
}

export function formatStellarAmount(
  amount: bigint,
  options?: {
    maxFractionDigits?: number;
    trimTrailingZeros?: boolean;
  },
): string {
  const maxFractionDigits = Math.min(
    options?.maxFractionDigits ?? STELLAR_DECIMALS,
    STELLAR_DECIMALS,
  );
  const trimTrailingZeros = options?.trimTrailingZeros ?? true;

  const sign = amount < BigInt(0) ? '-' : '';
  const absolute = amount < BigInt(0) ? -amount : amount;
  const whole = absolute / STELLAR_SCALE;
  let fraction = (absolute % STELLAR_SCALE).toString().padStart(STELLAR_DECIMALS, '0');
  fraction = fraction.slice(0, maxFractionDigits);

  if (trimTrailingZeros) {
    fraction = fraction.replace(/0+$/, '');
  }

  const wholeFormatted = addThousandsSeparators(whole.toString());
  if (!fraction) {
    return `${sign}${wholeFormatted}`;
  }

  return `${sign}${wholeFormatted}.${fraction}`;
}
