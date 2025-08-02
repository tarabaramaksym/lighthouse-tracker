-- Delete all Lighthouse reports and related data from today
-- Run these commands in order to avoid foreign key constraint issues

-- 1. Delete issue records from today (junction table)
DELETE FROM issue_records 
WHERE record_id IN (
    SELECT id FROM records 
    WHERE DATE("createdAt") = CURRENT_DATE
);

-- 2. Delete all records from today
DELETE FROM records 
WHERE DATE("createdAt") = CURRENT_DATE;

-- 3. Delete any orphaned issues (optional - only if you want to clean up unused issues)
-- DELETE FROM issues 
-- WHERE id NOT IN (
--     SELECT DISTINCT issue_id FROM issue_records
-- );

-- Verify the cleanup
SELECT 
    'Records deleted' as table_name,
    COUNT(*) as remaining_count
FROM records 
WHERE DATE("createdAt") = CURRENT_DATE

UNION ALL

SELECT 
    'Issue records deleted' as table_name,
    COUNT(*) as remaining_count
FROM issue_records ir
JOIN records r ON ir.record_id = r.id
WHERE DATE(r."createdAt") = CURRENT_DATE; 