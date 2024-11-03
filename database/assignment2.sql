-- Task 1: Insert a new record into the account table
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Task 2: Modify the Tony Stark record to change the account_type to "Admin"
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Task 3: Delete the Tony Stark record from the database
DELETE FROM public.account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Task 4: Modify the "GM Hummer" record description
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


-- Task 5: Use an inner join to select make and model with classification name for "Sport"
SELECT inv.inv_make, inv.inv_model, cl.classification_name
FROM public.inventory AS inv
INNER JOIN public.classification AS cl ON inv.classification_id = cl.classification_id
WHERE cl.classification_name = 'Sport';

-- Task 6: Update all records in the inventory table to modify file paths
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');