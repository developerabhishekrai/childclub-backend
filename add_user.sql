-- Add new school admin user
INSERT INTO `users` (`firstName`, `lastName`, `email`, `mobile`, `password`, `role`, `status`, `city`, `state`, `country`, `postalCode`, `emailVerified`, `mobileVerified`, `createdAt`, `updatedAt`) VALUES
('Aakash', 'Admin', 'aakash@yomail.com', '+91-8858724547', '$2a$12$/rEXjHp8T/PCJsVAv9eK5eTDog32ODcC360nlPUgtOjbD2y4Ww/jq', 'school_admin', 'active', 'Deoria', 'Uttar Pradesh', 'India', '274404', 1, 1, NOW(), NOW());

-- Get the user ID
SET @new_user_id = LAST_INSERT_ID();

-- Add school admin record
INSERT INTO `schools` (`name`, `description`, `type`, `status`, `city`, `state`, `country`, `postalCode`, `phone`, `website`, `email`, `establishedYear`, `totalStudents`, `totalTeachers`, `totalClasses`, `facilities`, `vision`, `mission`, `isActive`, `approvedAt`, `approvedBy`, `createdById`, `address`, `createdAt`, `updatedAt`) VALUES
('Aakash School', 'Aakash School Management', 'primary', 'approved', 'Deoria', 'Uttar Pradesh', 'India', '274404', '+91-8858724547', 'https://aakashschool.edu.in', 'aakash@yomail.com', 2024, 0, 0, 0, 'Basic facilities', 'Quality education', 'Student development', 1, NOW(), 1, @new_user_id, 'Deoria, UP', NOW(), NOW());

-- Get the school ID
SET @new_school_id = LAST_INSERT_ID();

-- Update user with school ID
UPDATE `users` SET `schoolId` = @new_school_id WHERE `id` = @new_user_id;
