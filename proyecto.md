# TEMTECH Dashboard CRM

## Product Requirements Document (PRD) + Technical Specification

---

# Objetivo General

Construir un dashboard SaaS moderno para TEMTECH Studio que funcione como:

* CRM de Leads
* Gestor de Clientes
* Gestor de Proyectos
* Gestor de Tareas
* Gestor de Presupuestos
* Centro de Archivos
* Portal interno para la agencia

El sistema debe tener una apariencia futurista, tecnológica y premium, alineada con la identidad visual de TEMTECH Studio.

Debe ser:

* Mobile First
* Full Responsive
* Accesible
* Escalable
* Optimizado para producción
* Preparado para crecer hacia un SaaS multiempresa

---

# Stack Tecnológico Obligatorio

## Frontend

* Next.js 15 App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide Icons
* Framer Motion
* React Query (TanStack Query)
* React Hook Form
* Zod

## Backend

* Supabase

Utilizar:

* Authentication
* PostgreSQL
* Row Level Security (RLS)
* Storage
* Realtime

## Drag and Drop

Utilizar:

* @dnd-kit/core
* @dnd-kit/sortable

NO utilizar react-beautiful-dnd.

---

# Diseño General

## Estilo Visual

Inspirado en:

* Linear
* Vercel
* Raycast
* Stripe Dashboard
* Supabase Studio

Sensación visual:

* Futurista
* Profesional
* Tecnológica
* Minimalista
* Premium

---

## Paleta Principal

Background:

```css
#080B14
#0F172A
#111827
```

Cards:

```css
#111827
#172033
```

Primary:

```css
#06B6D4
```

Secondary:

```css
#8B5CF6
```

Accent:

```css
#EC4899
```

Success:

```css
#22C55E
```

Warning:

```css
#F59E0B
```

Danger:

```css
#EF4444
```

---

## Efectos Visuales

Agregar:

* Glassmorphism sutil
* Glow cyan
* Glow violeta
* Blur backgrounds
* Gradientes modernos
* Hover transitions suaves
* Microinteracciones

---

## Animaciones

Framer Motion obligatorio.

Aplicar:

* Fade In
* Slide In
* Stagger Children
* Hover Scale
* Animated Counters
* Page Transitions

Duración máxima:

300ms

---

# Layout General

## Sidebar

Desktop:

Sidebar fija.

Mobile:

Sidebar tipo drawer.

Menú:

* Dashboard
* Leads
* Clientes
* Proyectos
* Tareas
* Presupuestos
* Archivos
* Configuración

---

## Topbar

Contendrá:

* Buscador global
* Notificaciones
* Perfil usuario
* Tema oscuro

---

# Módulos

---

# 1. Dashboard

Ruta:

```txt
/dashboard
```

Cards:

* Leads Totales
* Leads Nuevos
* Clientes Activos
* Proyectos Activos
* Presupuestos Pendientes

Widgets:

* Leads recientes
* Actividad reciente
* Pipeline comercial
* Próximas tareas

---

# 2. Leads

Ruta:

```txt
/leads
```

Tabla:

* Nombre
* Email
* WhatsApp
* Servicio
* Estado
* Fecha

Estados:

```txt
nuevo
contactado
propuesta_enviada
negociacion
ganado
perdido
```

Acciones:

* Crear
* Editar
* Eliminar
* Convertir a Cliente

---

# 3. Clientes

Ruta:

```txt
/clientes
```

Tabla:

* Nombre
* Empresa
* Email
* Teléfono
* Fecha alta

Acciones:

* Crear
* Editar
* Eliminar
* Ver Proyectos

---

# 4. Proyectos

Ruta:

```txt
/proyectos
```

Vista Kanban.

Columnas:

```txt
Pendiente
En Desarrollo
En Revisión
Entregado
```

Drag & Drop obligatorio.

Cada tarjeta mostrará:

* Nombre
* Cliente
* Fecha creación
* Estado

---

# 5. Tareas

Ruta:

```txt
/tareas
```

Vista Kanban.

Estados:

```txt
Pendiente
En progreso
Bloqueada
Completada
```

Drag & Drop obligatorio.

---

# 6. Presupuestos

Ruta:

```txt
/presupuestos
```

Campos:

* Cliente
* Servicio
* Valor
* Estado

Estados:

```txt
Borrador
Enviado
Aceptado
Rechazado
```

Preparar arquitectura para generación PDF futura.

---

# 7. Archivos

Ruta:

```txt
/archivos
```

Conectado a:

Supabase Storage

Permitir:

* Subir
* Descargar
* Eliminar

Tipos:

* PDF
* DOCX
* PNG
* JPG
* ZIP

---

# Autenticación

Supabase Auth.

Métodos:

* Email + Password

Roles:

```txt
admin
manager
developer
viewer
```

Middleware obligatorio.

Rutas privadas:

```txt
/dashboard
/leads
/clientes
/proyectos
/tareas
/presupuestos
/archivos
/configuracion
```

---

# Base de Datos

---

## profiles

```sql
id uuid pk
email text
full_name text
role text
avatar_url text
created_at timestamptz
```

---

## leads

```sql
id uuid pk
name text
email text
phone text
service text
message text
status text
created_at timestamptz
```

---

## clients

```sql
id uuid pk
name text
company text
email text
phone text
notes text
created_at timestamptz
```

---

## projects

```sql
id uuid pk
client_id uuid
name text
description text
status text
budget numeric
start_date date
end_date date
created_at timestamptz
```

---

## tasks

```sql
id uuid pk
project_id uuid
title text
description text
status text
priority text
assigned_to uuid
created_at timestamptz
```

---

## quotes

```sql
id uuid pk
client_id uuid
title text
amount numeric
status text
created_at timestamptz
```

---

## files

```sql
id uuid pk
project_id uuid
file_name text
file_url text
uploaded_by uuid
created_at timestamptz
```

---

# Relaciones

```txt
Client
 └── Projects

Project
 └── Tasks

Client
 └── Quotes

Project
 └── Files
```

---

# CRUD Requeridos

## Leads

Create:

```ts
supabase.from("leads").insert()
```

Read:

```ts
supabase.from("leads").select("*")
```

Update:

```ts
supabase.from("leads").update()
```

Delete:

```ts
supabase.from("leads").delete()
```

---

## Convertir Lead a Cliente

Cuando un Lead cambia a:

```txt
ganado
```

Ejecutar:

1. Crear registro en clients.
2. Mantener lead.
3. Relacionar lead con cliente.

Proceso automático.

---

## Clientes

CRUD completo.

---

## Proyectos

CRUD completo.

---

## Tareas

CRUD completo.

Actualizar estado automáticamente mediante drag and drop.

---

## Presupuestos

CRUD completo.

---

## Archivos

Subida:

```ts
supabase.storage
```

Listado:

```ts
supabase.storage.list()
```

Eliminación:

```ts
supabase.storage.remove()
```

---

# Arquitectura de Carpetas

```txt
src/

app/
components/
features/
hooks/
lib/
services/
types/
providers/
stores/

features/
 ├── dashboard
 ├── leads
 ├── clients
 ├── projects
 ├── tasks
 ├── quotes
 └── files
```

---

# Buenas Prácticas

Obligatorio:

* Server Components por defecto
* Client Components solo cuando sea necesario
* Server Actions cuando aplique
* React Query para datos dinámicos
* Zod para validaciones
* Tipado estricto
* Sin any
* Código modular
* Componentes reutilizables

---

# Responsive

Breakpoints:

```txt
Mobile
Tablet
Laptop
Desktop
Wide Desktop
```

Prioridad absoluta:

Mobile First.

Todo debe funcionar perfectamente desde:

320px

hasta

2560px.

---

# Objetivo de Calidad Final

El resultado debe parecer un producto SaaS comercial profesional y moderno, no un panel administrativo genérico.

Debe transmitir:

* Innovación
* Tecnología
* Profesionalismo
* Velocidad
* Escalabilidad

La experiencia de usuario debe sentirse superior a la de un dashboard CRUD tradicional.
