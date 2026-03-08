# Resource CRUD Pattern

A complete, production-ready CRUD pattern for managing any type of resource in your SaaS application.

## What's Included

### 1. Database Schema
`supabase/migrations/20260307000003_create_resources_table.sql`

- Full Postgres table with RLS policies
- Status enum (draft/active/archived)
- Automatic timestamps
- User ownership enforcement
- Optimized indexes

### 2. Server Actions
`lib/actions/resources.ts`

Type-safe server actions:
- `createResource(data)` - Create a new resource
- `getResources()` - List all user resources
- `getResource(id)` - Get single resource
- `updateResource(id, data)` - Update resource
- `deleteResource(id)` - Delete resource
- `duplicateResource(id)` - Clone a resource

### 3. React Components
`components/resources/`

- `ResourceList` - Table with actions menu (edit, duplicate, delete)
- `ResourceForm` - Create/edit form with validation

### 4. API Routes
`app/api/resources/`

RESTful API for external access:
- `GET /api/resources` - List resources (with pagination & filtering)
- `POST /api/resources` - Create resource
- `GET /api/resources/[id]` - Get single resource
- `PUT /api/resources/[id]` - Update resource
- `DELETE /api/resources/[id]` - Delete resource

## How to Adapt for Your Use Case

### 1. Choose Your Resource Name
Replace "resources" with your actual resource type:
- `projects`
- `documents`
- `invoices`
- `briefs`
- `campaigns`
- etc.

### 2. Update the Database Schema
Edit `supabase/migrations/20260307000003_create_resources_table.sql`:

```sql
-- Change table name
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  
  -- Add your custom fields here
  name text not null,
  description text,
  client_name text,
  deadline timestamptz,
  budget numeric(10,2),
  
  -- Keep these
  status text not null default 'draft' check (status in ('draft', 'active', 'completed', 'archived')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Update RLS policies, indexes, and triggers to match your table name
```

### 3. Update Server Actions
Edit `lib/actions/resources.ts`:

```typescript
// Update types
export type Project = {
  id: string
  user_id: string
  name: string
  description?: string
  client_name?: string
  deadline?: string
  budget?: number
  status: 'draft' | 'active' | 'completed' | 'archived'
  created_at: string
  updated_at: string
}

export type ProjectInput = {
  name: string
  description?: string
  client_name?: string
  deadline?: string
  budget?: number
  status?: Project['status']
}

// Update table references
// Find: .from('resources')
// Replace: .from('projects')

// Rename functions
// createResource -> createProject
// getResources -> getProjects
// etc.
```

### 4. Update Components
Rename and adapt components:
- `components/resources/` → `components/projects/`
- Update imports and type references
- Customize table columns for your fields
- Add custom form fields

### 5. Update API Routes
- Rename `app/api/resources/` → `app/api/projects/`
- Update table references
- Add custom query filters
- Add custom validation

### 6. Create Pages
Example dashboard page structure:

```tsx
// app/dashboard/projects/page.tsx
import { getProjects } from '@/lib/actions/projects'
import { ProjectList } from '@/components/projects/project-list'

export default async function ProjectsPage() {
  const { data: projects } = await getProjects()
  
  return (
    <div>
      <h1>Projects</h1>
      <ProjectList projects={projects || []} />
    </div>
  )
}

// app/dashboard/projects/new/page.tsx
import { ProjectForm } from '@/components/projects/project-form'

export default function NewProjectPage() {
  return (
    <div>
      <h1>New Project</h1>
      <ProjectForm mode="create" />
    </div>
  )
}

// app/dashboard/projects/[id]/edit/page.tsx
import { getProject } from '@/lib/actions/projects'
import { ProjectForm } from '@/components/projects/project-form'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data: project } = await getProject(id)
  
  if (!project) return <div>Not found</div>
  
  return (
    <div>
      <h1>Edit Project</h1>
      <ProjectForm mode="edit" project={project} />
    </div>
  )
}
```

## Common Customizations

### Add File Uploads
```typescript
// In server actions
export async function uploadProjectFile(projectId: string, file: File) {
  const supabase = await createClient()
  const filePath = `${projectId}/${file.name}`
  
  const { data, error } = await supabase.storage
    .from('project-files')
    .upload(filePath, file)
    
  if (error) return { error: error.message }
  
  // Update project with file reference
  await supabase
    .from('projects')
    .update({ file_url: data.path })
    .eq('id', projectId)
    
  return { data }
}
```

### Add Sharing/Collaboration
```sql
-- New table for shared access
create table project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text check (role in ('owner', 'editor', 'viewer')),
  created_at timestamptz default now()
);

-- Update RLS policies
create policy "Users can view projects they're members of"
  on projects for select
  using (
    user_id = auth.uid() OR
    id in (
      select project_id from project_members
      where user_id = auth.uid()
    )
  );
```

### Add Activity Log
```sql
create table project_activity (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  user_id uuid references auth.users(id),
  action text not null,
  metadata jsonb,
  created_at timestamptz default now()
);
```

### Add Search
```typescript
export async function searchProjects(query: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Unauthorized' }
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    
  if (error) return { error: error.message }
  return { data }
}
```

## Best Practices

1. **Always use RLS** - Row-level security prevents users accessing other users' data
2. **Validate inputs** - Add Zod schemas for type-safe validation
3. **Use optimistic updates** - Update UI immediately, roll back on error
4. **Add loading states** - Show skeletons while fetching data
5. **Handle errors gracefully** - Show user-friendly error messages with toast
6. **Revalidate paths** - Use `revalidatePath()` after mutations
7. **Add soft deletes** - Keep deleted items with `deleted_at` timestamp
8. **Track changes** - Add audit log for important resources

## Example: Converting to "Documents"

1. Rename migration: `create_documents_table.sql`
2. Change table: `create table documents`
3. Update actions: `lib/actions/documents.ts`
4. Rename components: `components/documents/`
5. Update API: `app/api/documents/`
6. Create pages: `app/dashboard/documents/`
7. Run migration: `supabase db push`

Done! You now have a complete CRUD system for documents.

## Performance Tips

### Add Pagination
```typescript
export async function getProjects(page = 1, pageSize = 20) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1
  
  const { data, error, count } = await supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .range(start, end)
    .order('created_at', { ascending: false })
    
  return {
    data,
    pagination: {
      page,
      pageSize,
      total: count || 0,
      hasMore: (count || 0) > end + 1,
    },
  }
}
```

### Add Caching
```typescript
import { unstable_cache } from 'next/cache'

export const getCachedProjects = unstable_cache(
  async (userId: string) => {
    // ... fetch logic
  },
  ['projects'],
  { revalidate: 60 } // Cache for 60 seconds
)
```

### Use Database Views
```sql
-- Create view for common queries
create view projects_with_stats as
select
  p.*,
  count(t.id) as task_count,
  count(t.id) filter (where t.completed) as completed_tasks
from projects p
left join tasks t on t.project_id = p.id
group by p.id;
```

## Testing

```typescript
// __tests__/resources.test.ts
import { createResource, getResources } from '@/lib/actions/resources'

describe('Resource CRUD', () => {
  it('creates a resource', async () => {
    const result = await createResource({
      name: 'Test Resource',
      description: 'Test description',
    })
    
    expect(result.error).toBeUndefined()
    expect(result.data?.name).toBe('Test Resource')
  })
  
  it('requires authentication', async () => {
    // Mock unauthenticated state
    const result = await getResources()
    expect(result.error).toBe('Unauthorized')
  })
})
```

## Additional Resources

- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [shadcn/ui Components](https://ui.shadcn.com/)
