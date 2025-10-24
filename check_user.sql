-- Check existing user
SELECT id, firstName, lastName, email, role, status, schoolId, createdAt 
FROM users 
WHERE email = 'aakash@yomail.com';

-- Check if user has a school
SELECT u.id, u.firstName, u.email, u.role, u.status, s.name as schoolName, s.status as schoolStatus
FROM users u
LEFT JOIN schools s ON u.schoolId = s.id
WHERE u.email = 'aakash@yomail.com';

