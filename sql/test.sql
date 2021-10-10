SELECT 
    u.u_id as u_id,
    e.name as event_name,
    e.badges as badge_link
from 
    u_users as u
INNER JOIN
    c_certificates as c 
        on c.u_id = u.u_id
INNER JOIN
    e_events as e
        on e.e_id = c.e_id
where u.email = 'a@gmail.com'
;