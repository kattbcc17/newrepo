-- Insert new data into the account table
INSERT INTO public.account 
(
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
Values 
(
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

-- Update the account table to change the account type of Tony Stark to Admin
UPDATE 
	public.account
SET 
	account_type = 'Admin'
WHERE 
	account_firstname = 'Tony';

-- Delete the account with the first name of Tony
DELETE FROM
	public.account
WHERE
	account_firstname = 'Tony';

-- Update the inventory table to change the description of all Hummers from 'small interiors' to 'a huge interior'
UPDATE 
	public.inventory
SET
	inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE
	inv_make = 'GM'
	AND
	inv_model = 'Hummer';

-- Select all inventory items that are classified as 'Sport'
SELECT
	inv.inv_make,
	inv.inv_model,
	cls.classification_name
FROM
	public.inventory inv
INNER JOIN
	public.classification cls
	ON cls.classification_id = inv.classification_id
WHERE
	cls.classification_name = 'Sport';

-- Update the inventory table to change the image and thumbnail paths to include the 'vehicles' directory
UPDATE 
	public.inventory
SET
	inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');