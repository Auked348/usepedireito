CREATE TABLE public.pix_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL,
  customer_email TEXT,
  customer_name TEXT,
  pix_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.pix_transactions TO service_role;

ALTER TABLE public.pix_transactions ENABLE ROW LEVEL SECURITY;