# 日本語 - Aplicación de Escritorio

Aplicación de escritorio minimalista que combina un temporizador Pomodoro con música lofi japonesa en vivo desde YouTube.

## Características

- 🍅 Temporizador Pomodoro (25 min trabajo / 5 min descanso)
- 🎵 Transmisión en vivo de música lofi japonesa
- 💖 Icono de corazón personalizado
- 🔔 Notificaciones de inicio/fin de sesiones
- 🔊 Alarma sonora configurable
- ⚙️ Tiempos personalizables
- 🎨 Interfaz moderna y responsiva
- 🖥️ Aplicación de escritorio standalone (no requiere navegador)
- 🪟 Ventana sin marco con transparencia y efecto blur (fondo semi-transparente negro)
- 🎮 Controles de ventana personalizados estilo macOS

## Instalación

### Linux (AppImage)

#### Desde Release (Recomendado)
1. Descarga el archivo `Nihongo-1.0.0-x86_64.AppImage` de la sección de [Releases](../../releases)
2. Dale permisos de ejecución: `chmod +x Nihongo-1.0.0-x86_64.AppImage`
3. Ejecuta el archivo: `./Nihongo-1.0.0-x86_64.AppImage`
4. ¡Disfruta de la app con su interfaz transparente!

#### Requisitos
- Electron instalado en el sistema (o viene embebido en el AppImage)
- Conexión a internet para el stream de YouTube

## Uso

1. Abre la aplicación 日本語
2. Se abrirá una ventana sin marco con fondo transparente y blur que muestra:
   - 🎥 Video de música lofi japonesa en vivo
   - ⏱️ Temporizador Pomodoro
   - ⚙️ Configuración (haz clic en el engranaje)
3. Haz clic en el botón ▶️ para iniciar el temporizador
4. Personaliza los tiempos de trabajo y descanso en la configuración
5. Mueve la ventana arrastrando desde la barra superior
6. Usa los botones de colores en la esquina superior derecha para cerrar/minimizar/maximizar
7. ¡Disfruta de la música mientras trabajas o estudias!

### Script de ejecución directo

Si prefieres no usar el AppImage, puedes ejecutar directamente:
```bash
cd /home/kuro/Desktop/Work/NihongoLofi
./nihongolofi.sh
```
O con Electron:
```bash
npm start
```

## Configuración

- **Trabajo**: Duración de las sesiones de trabajo (predeterminado: 25 minutos)
- **Descanso**: Duración de las sesiones de descanso (predeterminado: 5 minutos)
- **Notificaciones**: Activa/desactiva las notificaciones del navegador
- **Alarma**: Activa/desactiva el sonido de alarma

## Tecnologías

- Electron (Aplicación de escritorio multiplataforma)
- YouTube Embed Player API
- HTML5 + CSS3 + JavaScript
- Bootstrap 5.1.1
- Google Fonts (Roboto)
- LocalStorage para persistencia de configuración

## Licencia

MIT License

## Créditos

- Música lofi: [YouTube Live Stream](https://www.youtube.com/live/d6f46ZUzJig)
- Icono de corazón: Custom
- Inspirado en la extensión Lofidoro de Jonathan Polina

## Autor

Kuro
