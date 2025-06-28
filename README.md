# Youth Sports Academy Management Platform

A comprehensive platform for managing youth sports organizations built with React and Supabase, featuring advanced financial controls, team management, sponsor integration, and role-based access control.

## 🚀 Features

### Core Functionality
- **Multi-Role Authentication**: Super Admin, Admin, Trainer, Parent, Player, and Sponsor roles
- **Financial Management**: Invoice generation, payment processing, fee adjustments
- **Team & Player Management**: Complete roster management with attendance tracking
- **Scheduling System**: Training sessions, matches, and event management
- **Communication Platform**: Messaging system with announcements
- **Sponsorship Management**: Tiered packages with banner management and analytics
- **Reporting & Analytics**: Comprehensive reporting with custom dashboards

### Role-Based Features

#### Super Admin
- Complete system access and configuration
- User management and role assignment
- Financial controls and audit logs
- System monitoring and security settings

#### Admin
- Manage users, teams, and players
- Financial operations and reporting
- Communication management
- Store and inventory management

#### Trainer
- Team management and roster control
- Attendance tracking and session planning
- Player performance notes
- Limited financial visibility

#### Parent
- View and manage children's information
- Make payments and view invoices
- Access schedules and communications
- Store purchases

#### Player
- View personal schedule and attendance
- Access team communications
- Performance tracking
- Limited profile management

#### Sponsor
- Manage company profile and banners
- Purchase advertising packages
- View analytics and performance metrics
- Upload marketing materials

## 🛠 Technology Stack

- **Frontend**: React 18 with Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Functions)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Routing**: React Router DOM
- **Notifications**: React Toastify
- **Payment Processing**: Stripe integration
- **Authentication**: Supabase Auth with JWT

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd youth-sports-academy
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## 🗄 Database Setup

The application requires a Supabase project with the following tables:

### Core Tables
- `profiles` - User profiles with role information
- `players` - Player information and status
- `teams` - Team management
- `team_players` - Player-team relationships
- `parent_player_relationships` - Family connections

### Financial Tables
- `seasons` - Season management
- `player_fees` - Custom fee structures
- `invoices` - Invoice management
- `payments` - Payment tracking
- `fee_adjustments` - Financial adjustments with audit

### Scheduling Tables
- `locations` - Training facilities
- `training_sessions` - Session scheduling
- `attendance` - Attendance tracking

### Communication Tables
- `message_threads` - Conversation management
- `thread_participants` - Message participants
- `messages` - Message content
- `message_attachments` - File attachments

### Sponsorship Tables
- `sponsors` - Sponsor information
- `sponsor_packages` - Package definitions
- `sponsor_subscriptions` - Active sponsorships
- `sponsor_banners` - Banner management

### System Tables
- `app_config` - System configuration
- `admin_audit_log` - Audit trail
- `role_permissions` - Permission management

## 🔐 Security

- Row Level Security (RLS) on all tables
- Role-based access control
- JWT authentication
- Encrypted sensitive data
- Audit logging for admin actions
- Session management and timeout

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider

3. Set environment variables in your hosting dashboard

### Supabase Configuration

1. Create a new Supabase project
2. Run the database migrations
3. Configure RLS policies
4. Set up Edge Functions for advanced features
5. Configure Stripe webhooks

## 📊 Key Features Breakdown

### Financial Management
- Automated monthly invoice generation
- Flexible fee structures per player/team
- Payment processing with Stripe
- Financial adjustments with approval workflow
- Comprehensive financial reporting

### Team Management
- Multi-season support
- Flexible team structures
- Player transfers with history
- Attendance tracking
- Performance monitoring

### Communication
- Role-based messaging
- Announcement system
- File sharing
- Notification preferences
- Email integration

### Sponsorship System
- Tiered package management
- Banner upload and approval
- Analytics and reporting
- Payment processing
- ROI tracking

## 🔧 Customization

The platform is highly configurable through:
- Super admin configuration panel
- Custom fields for different roles
- Flexible fee structures
- Customizable notification settings
- White-label branding options

## 📈 Analytics & Reporting

- Real-time dashboards
- Custom report builder
- Financial analytics
- Attendance reporting
- Sponsor performance metrics
- User activity tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Core authentication and user management
- ✅ Basic dashboard implementations
- ✅ Role-based navigation
- 🔄 Financial management system

### Phase 2 (Next)
- 📅 Complete team and player management
- 📅 Advanced scheduling system
- 📅 Communication platform
- 📅 Attendance tracking

### Phase 3 (Future)
- 📅 Sponsorship management
- 📅 Advanced reporting
- 📅 Mobile applications
- 📅 API integrations

---

Built with ❤️ for youth sports organizations worldwide.