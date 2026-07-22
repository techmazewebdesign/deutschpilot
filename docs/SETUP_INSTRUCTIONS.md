# Plucogroup Website - Setup & Fix Instructions

## What Was Fixed

### 1. **User Dashboard - Ticket Submission**
- ✅ Created `/api/tickets` endpoint for creating and retrieving support tickets
- ✅ Added `TicketForm` component to the student dashboard
- ✅ Tickets are now saved to Supabase with status tracking

### 2. **User Profile - Edit & Save**
- ✅ Created `/api/profile/update` endpoint for updating profile information
- ✅ Added `EditProfileForm` component with name editing capability
- ✅ Profile changes are now saved to Supabase and persist on page reload
- ✅ Displays success/error messages to users

### 3. **Admin Dashboard - User Management**
- ✅ Verified `/api/admin/users` endpoint for Firebase operations
- ✅ Added proper error handling and loading states
- ✅ User role changes and disable/enable actions now work correctly

---

## Database Setup (IMPORTANT)

You **must** run the SQL migration to set up the required tables in Supabase.

### Steps to Set Up Supabase:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to your `deutschpilot-be999` project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the entire contents of `/docs/SUPABASE_SETUP.sql`
6. Click **Run** button

The SQL will:
- Create the `tickets` table with proper fields and permissions
- Ensure the `profiles` table exists with update capability
- Set up Row Level Security (RLS) policies for data protection
- Create indexes for performance
- Set up automatic timestamp updates

---

## Features Overview

### Creating Support Tickets
Users can now:
1. Click "Create Ticket" button on the student dashboard
2. Fill in subject, message, and priority level
3. Submit the ticket
4. Tickets are stored in Supabase with status tracking

### Editing User Profile
Users can now:
1. Click "Edit Profile" button on their profile page
2. Change their full name
3. Click "Save Changes" to persist to database
4. Success/error messages confirm the operation

### Admin User Management
Admins can:
1. View all users in a table
2. Change user roles (Student/Teacher/Admin)
3. Enable/disable user accounts
4. Delete users (with confirmation)
5. All changes are saved to Firebase

---

## API Endpoints

### Profile Update
- **Endpoint**: `PATCH /api/profile/update`
- **Auth**: Required (session cookie)
- **Body**: `{ "full_name": "New Name", "german_level": "B1" }`
- **Returns**: Updated profile object

### Tickets - List & Create
- **Get Tickets**: `GET /api/tickets`
  - Auth: Required
  - Returns: Array of user's tickets

- **Create Ticket**: `POST /api/tickets`
  - Auth: Required
  - Body: `{ "subject": "...", "message": "...", "priority": "normal|high|low" }`
  - Returns: Created ticket object

### Admin Users
- **Get Users**: `GET /api/admin/users`
  - Auth: Admin required
  - Returns: Array of all users

- **Update User**: `PATCH /api/admin/users`
  - Auth: Admin required
  - Body: `{ "uid": "...", "role": "...", "disabled": true/false }`

- **Delete User**: `DELETE /api/admin/users`
  - Auth: Admin required
  - Body: `{ "uid": "..." }`

---

## Testing Checklist

After setup, verify:

- [ ] Profile page loads correctly
- [ ] "Edit Profile" button appears and works
- [ ] Can edit name and save successfully
- [ ] Message appears after successful save
- [ ] Page refreshes and shows saved name
- [ ] Student dashboard shows "Create Ticket" button
- [ ] Ticket form opens when button is clicked
- [ ] Can submit a support ticket
- [ ] Success message appears after submission
- [ ] Admin can see users in admin dashboard
- [ ] Admin can change user roles
- [ ] Admin can enable/disable users
- [ ] Admin can delete users with confirmation

---

## Troubleshooting

### "Database error" message appears
1. Ensure you've run the SQL migration in Supabase
2. Check Supabase RLS policies are enabled
3. Verify `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`

### Profile won't save
1. Check browser console for errors (F12 → Console tab)
2. Verify user is authenticated (check session cookie)
3. Ensure Supabase is responding (check Supabase status)

### Tickets not showing
1. Verify tickets table exists in Supabase
2. Check RLS policies allow user access
3. Check network tab in browser dev tools for API errors

### Admin actions not working
1. Verify user has admin role in Firebase
2. Check Firebase Admin SDK credentials in `.env.local`
3. Ensure user exists in Firebase before deleting

---

## Files Changed/Created

### New Files:
- `/app/api/profile/update/route.ts` - Profile update endpoint
- `/app/api/tickets/route.ts` - Tickets API endpoint
- `/components/profile/edit-profile-form.tsx` - Profile edit component
- `/components/dashboard/ticket-form.tsx` - Ticket submission component
- `/docs/SUPABASE_SETUP.sql` - Database migration SQL

### Modified Files:
- `/app/[locale]/profile/page.tsx` - Integrated EditProfileForm
- `/app/[locale]/student/dashboard/page.tsx` - Added TicketForm component

---

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Review the API response in the Network tab (F12)
3. Verify all environment variables are set correctly
4. Ensure Supabase tables exist with correct permissions
5. Check Firebase Admin SDK configuration

---

## Next Steps (Optional Enhancements)

Consider adding:
- [ ] Photo/avatar upload for profiles
- [ ] Ticket history/details view
- [ ] Email notifications for ticket status changes
- [ ] Ticket priority indicators in admin panel
- [ ] User activity logs
- [ ] Bulk user import/export for admins
