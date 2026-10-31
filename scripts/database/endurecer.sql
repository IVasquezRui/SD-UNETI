-- Endurecimiento de MariaDB para el stack SD-UNETI.
-- Se ejecuta solo al inicializar un volumen nuevo.
-- Elimina el acceso remoto de root; las aplicaciones usan wp_user.

DROP USER IF EXISTS 'root'@'%';
FLUSH PRIVILEGES;
