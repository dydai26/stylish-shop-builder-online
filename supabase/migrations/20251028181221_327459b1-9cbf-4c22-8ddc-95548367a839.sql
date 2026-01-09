
-- Create policies for orders table to allow public access for checkout

-- Allow anyone to insert orders (for public checkout)
CREATE POLICY "Allow public to create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to view all orders (admins need this)
CREATE POLICY "Allow public to view orders" 
ON public.orders 
FOR SELECT 
USING (true);

-- Allow anyone to update orders (for status updates)
CREATE POLICY "Allow public to update orders" 
ON public.orders 
FOR UPDATE 
USING (true);
