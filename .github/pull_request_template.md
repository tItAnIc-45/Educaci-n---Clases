### Descripción del cambio
<!-- Explica brevemente qué agrega o soluciona este PR -->

### Módulo / Carpeta
- [ ] /src (Componentes / Vistas)
- [ ] /public (Recursos estáticos)
- [ ] Configuración / Entorno (package.json, vite.config.js)
- [ ] Documentación (README.md)

### Checklist Técnico y Seguridad (EQU-02 + React)
- [ ] H01 (Secretos): No hay contraseñas, tokens de API, credenciales ni llaves expuestas en el código, historial o archivos .env.
- [ ] A04 (Dependencias): Nuevas dependencias registradas en package.json, autorizadas y sin alertas de vulnerabilidad crítica (npm audit).
- [ ] A05 (Higiene y Aislamiento): Solo se modificó la carpeta correspondiente a la tarea. Estrictamente sin carpetas node_modules/ ni archivos de compilación (dist/).
- [ ] Compilación y Build: El proyecto compila localmente sin errores con npm run build y los recursos/imágenes cargan correctamente.
- [ ] B04 (Contenido): Sin textos de prueba rotos ni enlaces caídos; datos de muestra 100% ficticios.
- [ ] D01 (Responsive): Probado en móvil, tablet y escritorio sin cortes ni desbordes.
- [ ] I03 (Privacidad): Formularios con validación adecuada y recolección mínima de datos.
- [ ] Publicación: La acción de despliegue (GitHub Actions) finaliza en verde y el sitio abre íntegramente en la URL publicada.

### Evidencia de pruebas
<!-- Pega aquí capturas de pantalla de la prueba en local ('npm run dev'), build limpio ('npm run build') o prueba visual en navegador -->
