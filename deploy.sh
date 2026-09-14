#!/bin/bash
# =====================================================================
# SCRIPT DE DESPLIEGUE SEGURO PARA FILITOUR EN VPS
# Ejecuta este script en tu servidor Linux para desplegar con seguridad
# =====================================================================

set -e

echo "🚀 Iniciando despliegue seguro de FiliTour..."

# 1. Crear directorio de secretos si no existe
mkdir -p ./secrets

# 2. Generar contraseña segura para la base de datos (si no existe)
if [ ! -f ./secrets/db_root_password.txt ]; then
    echo "🔐 Generando contraseña segura para la base de datos..."
    openssl rand -base64 32 > ./secrets/db_root_password.txt
    chmod 600 ./secrets/db_root_password.txt
    echo "✅ Contraseña generada y guardada en ./secrets/db_root_password.txt"
else
    echo "⚠️  El archivo de contraseña ya existe. Usando existente."
fi

# 3. Crear directorio de logs con permisos correctos
mkdir -p ./app/storage/logs/bruteforce
chmod 755 ./app/storage/logs/bruteforce
chmod 755 ./app/storage/logs
echo "✅ Directorios de logs creados con permisos correctos"

# 4. Detener contenedores existentes (si los hay)
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down 2>/dev/null || true

# 5. Levantar contenedores
echo "🐳 Levantando contenedores Docker..."
docker-compose up -d --build

# 6. Esperar a que la BD esté lista
echo "⏳ Esperando a que la base de datos esté lista..."
sleep 10

# 7. Mostrar información importante
echo ""
echo "====================================================================="
echo "✅ DESPLIEGUE COMPLETADO EXITOSAMENTE"
echo "====================================================================="
echo ""
echo "📋 INFORMACIÓN IMPORTANTE:"
echo ""
echo "🌐 Tu aplicación está disponible en: http://TU_IP_O_DOMINIO:8080"
echo ""
echo "🔒 CREDENCIALES DE ADMINISTRADOR POR DEFECTO:"
echo "   Usuario: admin"
echo "   Contraseña: admin123"
echo ""
echo "   ⚠️  ¡CAMBIA LA CONTRASEÑA INMEDIATAMENTE DESPUÉS DEL PRIMER LOGIN!"
echo ""
echo "🗄️  CONTRASEÑA DE BASE DE DATOS:"
echo "   Guardada en: ./secrets/db_root_password.txt"
echo "   Para verla: cat ./secrets/db_root_password.txt"
echo ""
echo "🔧 SIGUIENTES PASOS RECOMENDADOS:"
echo "   1. Configurar SSL con Let's Encrypt (Certbot)"
echo "   2. Configurar firewall (UFW): permitir solo puertos 80, 443, 22"
echo "   3. Instalar Fail2Ban para protección adicional"
echo "   4. Cambiar la contraseña del admin por una segura"
echo "   5. Eliminar o proteger el acceso a phpMyAdmin en producción"
echo ""
echo "====================================================================="
echo ""
