# CI Master Suite

A comprehensive continuous improvement platform for industrial engineering, manufacturing, and process optimization professionals. Built with Next.js 15, TypeScript, and Supabase.

## Overview

CI Master Suite is an enterprise-grade B2B SaaS platform that provides essential tools for Six Sigma, Lean Manufacturing, and Continuous Improvement methodologies. The platform enables industrial engineers, production managers, and manufacturing consultants to conduct sophisticated data analysis, process optimization, and continuous improvement initiatives.

## Features

### Six Sigma Tools

- **Process Capability Analysis**: Calculate Cp, Cpk, Pp, Ppk indices with comprehensive statistical analysis
- **Statistical Process Control (SPC)**: Real-time control charts with Western Electric rules detection
- **Hypothesis Testing**: Multiple test types including t-tests, z-tests, ANOVA, and chi-square
- **Design of Experiments (DOE)**: Full factorial and fractional factorial experimental designs

### Lean Manufacturing Tools

- **Overall Equipment Effectiveness (OEE)**: Track availability, performance, and quality metrics
- **Value Stream Mapping (VSM)**: Analyze and optimize material and information flows
- **Kanban System**: Visual workflow management with drag-and-drop functionality
- **5S Implementation**: Structure workplace organization and standardization initiatives

### Continuous Improvement Tools

- **A3 Problem Solving**: Structured approach to problem identification and resolution
- **5 Why Analysis**: Root cause analysis through iterative questioning
- **PDCA Cycle**: Plan-Do-Check-Act continuous improvement framework

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **State Management**: React Hooks + Context

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication routes
│   ├── dashboard/           # Main application dashboard
│   │   ├── six-sigma/       # Six Sigma tool pages
│   │   ├── lean/            # Lean Manufacturing tool pages
│   │   └── continuous-improvement/  # CI tool pages
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── charts/              # Chart components (SPC, VSM, etc.)
│   ├── data/                # Data import/export components
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── calculations/        # Statistical calculations and algorithms
│   ├── supabase/            # Supabase client configuration
│   └── utils.ts             # Utility functions
├── hooks/
│   └── useAuth.ts           # Authentication hook
└── types/
    └── database.ts          # TypeScript database types
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/ci-master.git
cd ci-master
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

See `env-template.txt` for the complete list of required environment variables.

4. Set up the database:
Run the SQL scripts in the following order:
- `authentication-setup.sql` - Authentication schema
- `phase-4-database-schema.sql` - Complete database schema

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

Create a production build:

```bash
npm run build
npm start
```

## Key Capabilities

### Statistical Analysis
- Advanced statistical calculations for process capability
- Control chart generation with multiple rule sets
- Hypothesis testing with confidence intervals
- Correlation and regression analysis

### Data Management
- CSV import/export functionality
- Real-time data validation
- Historical data storage and retrieval
- Multi-user collaboration support

### Visualization
- Interactive charts and graphs
- Real-time data updates
- Responsive design for all devices
- Print-ready reports

### User Management
- Secure authentication with Supabase
- Role-based access control
- Team collaboration features
- Audit trail and activity logging

## Implementation Status

- ✅ **Phase 1**: Core infrastructure and authentication
- ✅ **Phase 2**: Six Sigma tools suite
- ✅ **Phase 3**: Lean Manufacturing tools
- ✅ **Phase 4**: Continuous Improvement tools and data persistence

See `IMPLEMENTATION_ROADMAP.md` for detailed implementation history.

## Documentation

- **Technical Specification**: `CI_Master_Suite_Technical_Specification.md`
- **Product Requirements**: `CI_Master_Suite_PRD.json`
- **System Summary**: `COMPLETE_SYSTEM_SUMMARY.md`
- **Phase Progress**: `PHASE_2_PROGRESS.md`, `PHASE_3_PROGRESS.md`, `PHASE_4_IMPLEMENTATION_STATUS.md`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

[Add your license here]

## Support

For support, email support@cimaster.com or open an issue in the GitHub repository.

## Acknowledgments

Built with modern web technologies and best practices for industrial engineering and manufacturing excellence.
