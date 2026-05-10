const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { DataTypes, Sequelize } = require('sequelize');

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: 'mysql',
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME || 'portfolio_platform',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        dialect: 'mysql',
        logging: false,
      },
    );

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(180),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'moderator', 'user'),
      allowNull: false,
      defaultValue: 'user',
    },
    status: {
      type: DataTypes.ENUM('active', 'blocked'),
      allowNull: false,
      defaultValue: 'active',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'users',
    modelName: 'User',
  },
);

const Portfolio = sequelize.define(
  'Portfolio',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(140),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    location: {
      type: DataTypes.STRING(140),
      allowNull: false,
      defaultValue: '',
    },
    category: {
      type: DataTypes.ENUM(
        'Frontend',
        'Backend',
        'Full Stack',
        'UI/UX',
        'Mobile',
        'DevOps',
      ),
      allowNull: false,
      defaultValue: 'Full Stack',
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:
        'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200',
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('approved', 'pending', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
    views: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    followers: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    likes: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    linkClicks: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'portfolios',
    modelName: 'Portfolio',
  },
);

const Project = sequelize.define(
  'Project',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    portfolioId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Portfolio,
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(140),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    tech: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    githubUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    liveUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    views: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    likes: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'projects',
    modelName: 'Project',
  },
);

const Report = sequelize.define(
  'Report',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    portfolioId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Portfolio,
        key: 'id',
      },
    },
    reporterId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    reason: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    status: {
      type: DataTypes.ENUM('open', 'resolved'),
      allowNull: false,
      defaultValue: 'open',
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'reports',
    modelName: 'Report',
  },
);

const Favorite = sequelize.define(
  'Favorite',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    portfolioId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'favorites',
    modelName: 'Favorite',
    indexes: [{ unique: true, fields: ['userId', 'portfolioId'] }],
  },
);

const RecentView = sequelize.define(
  'RecentView',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    portfolioId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    viewedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'recent_views',
    modelName: 'RecentView',
    indexes: [{ unique: true, fields: ['userId', 'portfolioId'] }],
  },
);

const Comment = sequelize.define(
  'Comment',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    portfolioId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    projectId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    body: { type: DataTypes.TEXT, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'comments',
    modelName: 'Comment',
  },
);

const Notification = sequelize.define(
  'Notification',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    type: {
      type: DataTypes.ENUM(
        'portfolio_liked',
        'portfolio_approved',
        'portfolio_commented',
        'project_commented',
      ),
      allowNull: false,
    },
    message: { type: DataTypes.STRING(255), allowNull: false },
    metadata: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
    readAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'notifications',
    modelName: 'Notification',
  },
);

const AnalyticsEvent = sequelize.define(
  'AnalyticsEvent',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    portfolioId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    projectId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    type: {
      type: DataTypes.ENUM(
        'portfolio_view',
        'github_click',
        'live_demo_click',
        'project_view',
      ),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'analytics_events',
    modelName: 'AnalyticsEvent',
  },
);

const cmsContentFields = {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(180), allowNull: false },
  slug: { type: DataTypes.STRING(140), allowNull: false, unique: true },
  excerpt: { type: DataTypes.TEXT, allowNull: false },
  content: { type: DataTypes.TEXT('long'), allowNull: false },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    allowNull: false,
    defaultValue: 'draft',
  },
  seoTitle: { type: DataTypes.STRING(180), allowNull: true },
  seoDescription: { type: DataTypes.STRING(260), allowNull: true },
  featuredImageUrl: { type: DataTypes.STRING, allowNull: true },
  publishedAt: { type: DataTypes.DATE, allowNull: true },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
};

const CmsPage = sequelize.define('CmsPage', cmsContentFields, {
  tableName: 'cms_pages',
  modelName: 'CmsPage',
});

const CmsPost = sequelize.define('CmsPost', cmsContentFields, {
  tableName: 'cms_posts',
  modelName: 'CmsPost',
});

const CmsService = sequelize.define(
  'CmsService',
  {
    ...cmsContentFields,
    icon: { type: DataTypes.STRING(80), allowNull: true },
    sortOrder: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'cms_services',
    modelName: 'CmsService',
  },
);

const CmsFaq = sequelize.define(
  'CmsFaq',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    question: { type: DataTypes.STRING(240), allowNull: false },
    answer: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING(100), allowNull: false, defaultValue: '' },
    sortOrder: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
    },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'cms_faqs',
    modelName: 'CmsFaq',
  },
);

const ContactSubmission = sequelize.define(
  'ContactSubmission',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(180), allowNull: false },
    subject: { type: DataTypes.STRING(180), allowNull: false, defaultValue: '' },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM('new', 'read', 'archived'),
      allowNull: false,
      defaultValue: 'new',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'contact_submissions',
    modelName: 'ContactSubmission',
  },
);

User.hasMany(Portfolio, {
  foreignKey: 'userId',
  as: 'portfolios',
  onDelete: 'CASCADE',
});

Portfolio.belongsTo(User, {
  foreignKey: 'userId',
  as: 'owner',
});

Portfolio.hasMany(Project, {
  foreignKey: 'portfolioId',
  as: 'projects',
  onDelete: 'CASCADE',
});

Project.belongsTo(Portfolio, {
  foreignKey: 'portfolioId',
  as: 'portfolio',
});

Portfolio.hasMany(Report, {
  foreignKey: 'portfolioId',
  as: 'reports',
  onDelete: 'CASCADE',
});

Report.belongsTo(Portfolio, {
  foreignKey: 'portfolioId',
  as: 'portfolio',
});

User.hasMany(Report, {
  foreignKey: 'reporterId',
  as: 'reports',
});

Report.belongsTo(User, {
  foreignKey: 'reporterId',
  as: 'reporter',
});

Favorite.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });
RecentView.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });
RecentView.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Comment.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });
Comment.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
AnalyticsEvent.belongsTo(Portfolio, { foreignKey: 'portfolioId', as: 'portfolio' });
AnalyticsEvent.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
AnalyticsEvent.belongsTo(User, { foreignKey: 'userId', as: 'user' });

const users = [
  {
    name: 'Admin User',
    email: 'admin@portify.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'CMS Moderator',
    email: 'moderator@portify.com',
    password: 'moderator123',
    role: 'moderator',
  },
  {
    name: 'Marko Ilic',
    email: 'marko@example.com',
    password: 'user123',
    role: 'user',
  },
  {
    name: 'Lana Petrovic',
    email: 'lana@example.com',
    password: 'user123',
    role: 'user',
  },
  {
    name: 'Sara Novak',
    email: 'sara@example.com',
    password: 'user123',
    role: 'user',
  },
  {
    name: 'Nikola Vasic',
    email: 'nikola@example.com',
    password: 'user123',
    role: 'user',
  },
  {
    name: 'Mila Kovac',
    email: 'mila@example.com',
    password: 'user123',
    role: 'user',
  },
  {
    name: 'Ivan Horvat',
    email: 'ivan@example.com',
    password: 'user123',
    role: 'user',
    status: 'blocked',
  },
];

const portfolios = [
  {
    ownerEmail: 'lana@example.com',
    title: 'Lana Petrovic',
    slug: 'lana.design',
    role: 'Product Designer',
    category: 'UI/UX',
    location: 'Belgrade, Serbia',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    coverImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200',
    bio: 'Designing clean digital products with strong visual identity and smooth user experience.',
    views: 18300,
    followers: 1240,
    likes: 3820,
    linkClicks: 640,
    featured: true,
    status: 'approved',
    projects: [
      {
        title: 'Design System Kit',
        description: 'Reusable UI foundations, token structure and Figma components for SaaS dashboards.',
        tech: ['Figma', 'Design Systems', 'UX Research'],
        image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=900',
        liveUrl: 'https://lana.design',
        views: 8420,
        likes: 920,
      },
      {
        title: 'Research Portal',
        description: 'A research library concept with interview notes, tags and insight boards.',
        tech: ['Figma', 'Prototyping', 'User Testing'],
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900',
        views: 5180,
        likes: 640,
      },
    ],
  },
  {
    ownerEmail: 'marko@example.com',
    title: 'Marko Ilic',
    slug: 'markodev',
    role: 'Full Stack Developer',
    category: 'Full Stack',
    location: 'Banja Luka, BiH',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200',
    bio: 'Building scalable web apps with React, Node.js, MySQL and clean backend architecture.',
    views: 32400,
    followers: 2180,
    likes: 4738,
    linkClicks: 892,
    featured: true,
    status: 'approved',
    projects: [
      {
        title: 'Portfolio Platform API',
        description: 'Express and Sequelize API with JWT authentication, admin moderation and project management.',
        tech: ['React', 'Node.js', 'MySQL'],
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900',
        githubUrl: 'https://github.com/markodev/portfolio-api',
        liveUrl: 'https://markodev.dev',
        views: 9600,
        likes: 1260,
      },
      {
        title: 'Realtime Task Board',
        description: 'Kanban workspace with team permissions, filters and realtime activity updates.',
        tech: ['TypeScript', 'Express', 'Socket.IO'],
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900',
        views: 6240,
        likes: 840,
      },
    ],
  },
  {
    ownerEmail: 'sara@example.com',
    title: 'Sara Novak',
    slug: 'saranovak',
    role: 'Frontend Engineer',
    category: 'Frontend',
    location: 'Zagreb, Croatia',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
    bio: 'Creating beautiful interfaces with React, animations, accessibility and performance in mind.',
    views: 26700,
    followers: 1750,
    likes: 3580,
    linkClicks: 710,
    featured: false,
    status: 'pending',
    projects: [
      {
        title: 'Interactive Landing Builder',
        description: 'Composable page builder with responsive blocks and accessible keyboard workflows.',
        tech: ['React', 'TypeScript', 'Tailwind'],
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900',
        views: 7420,
        likes: 1110,
      },
    ],
  },
  {
    ownerEmail: 'nikola@example.com',
    title: 'Nikola Vasic',
    slug: 'nikola.api',
    role: 'Backend Developer',
    category: 'Backend',
    location: 'Novi Sad, Serbia',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200',
    bio: 'Focused on APIs, databases, clean architecture, authentication and scalable backend systems.',
    views: 14800,
    followers: 980,
    likes: 2260,
    linkClicks: 430,
    featured: false,
    status: 'approved',
    projects: [
      {
        title: 'Auth Service',
        description: 'JWT authentication service with refresh sessions, role guards and audit logging.',
        tech: ['Express', 'Sequelize', 'MySQL'],
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900',
        views: 3960,
        likes: 520,
      },
    ],
  },
  {
    ownerEmail: 'mila@example.com',
    title: 'Mila Kovac',
    slug: 'mila.mobile',
    role: 'Mobile App Developer',
    category: 'Mobile',
    location: 'Sarajevo, BiH',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
    coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200',
    bio: 'Crafting smooth mobile experiences with React Native, animations and product thinking.',
    views: 20100,
    followers: 1430,
    likes: 3180,
    linkClicks: 760,
    featured: true,
    status: 'approved',
    projects: [
      {
        title: 'Habit Tracker',
        description: 'Mobile tracking app with offline persistence, reminders and streak analytics.',
        tech: ['React Native', 'Expo', 'Firebase'],
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=900',
        views: 6840,
        likes: 970,
      },
    ],
  },
  {
    ownerEmail: 'ivan@example.com',
    title: 'Ivan Horvat',
    slug: 'ivan.cloud',
    role: 'DevOps Engineer',
    category: 'DevOps',
    location: 'Split, Croatia',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
    bio: 'Automating deployments, monitoring infrastructure and building reliable cloud workflows.',
    views: 9900,
    followers: 760,
    likes: 1480,
    linkClicks: 310,
    featured: false,
    status: 'rejected',
    projects: [
      {
        title: 'Cloud Deploy Pipeline',
        description: 'CI/CD pipeline with containerized services, health checks and rollback automation.',
        tech: ['Docker', 'AWS', 'CI/CD'],
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900',
        views: 2820,
        likes: 360,
      },
    ],
  },
];

const reports = [
  {
    portfolioSlug: 'saranovak',
    reporterEmail: 'marko@example.com',
    reason: 'Misleading project details',
    details: 'The live demo link needs review before approval.',
    status: 'open',
  },
  {
    portfolioSlug: 'ivan.cloud',
    reporterEmail: 'lana@example.com',
    reason: 'Broken live demo links',
    details: 'Several project links appear to be unavailable.',
    status: 'open',
  },
  {
    portfolioSlug: 'markodev',
    reporterEmail: 'mila@example.com',
    reason: 'Duplicate content',
    details: 'Resolved after checking project ownership.',
    status: 'resolved',
    resolvedAt: new Date(),
  },
];

const publishedAt = new Date();

const cmsPages = [
  {
    title: 'About Portify',
    slug: 'about-portify',
    excerpt: 'Learn how Portify helps creators publish polished portfolios.',
    content:
      'Portify is a portfolio platform for developers, designers and digital creators who want a focused public presence.',
    status: 'published',
    seoTitle: 'About Portify',
    seoDescription: 'Learn more about the Portify portfolio platform.',
    featuredImageUrl: null,
    publishedAt,
  },
  {
    title: 'Creator Guidelines',
    slug: 'creator-guidelines',
    excerpt: 'Best practices for publishing high-quality portfolio content.',
    content:
      'Keep project descriptions clear, use real screenshots, and keep contact links current.',
    status: 'draft',
    seoTitle: 'Creator Guidelines',
    seoDescription: 'Guidelines for publishing content on Portify.',
    featuredImageUrl: null,
    publishedAt: null,
  },
];

const cmsPosts = [
  {
    title: 'How to Build a Strong Portfolio',
    slug: 'strong-portfolio',
    excerpt: 'A practical checklist for portfolio structure, case studies and proof.',
    content:
      'Start with your strongest work, explain the problem, show the process, and make outcomes easy to scan.',
    status: 'published',
    seoTitle: 'How to Build a Strong Portfolio',
    seoDescription: 'A practical guide for creating a stronger online portfolio.',
    featuredImageUrl: null,
    publishedAt,
  },
];

const cmsServices = [
  {
    title: 'Portfolio Review',
    slug: 'portfolio-review',
    excerpt: 'Editorial review for creators who want sharper portfolio content.',
    content:
      'A structured review that checks clarity, project proof, visuals and conversion points.',
    icon: 'search-check',
    sortOrder: 1,
    status: 'published',
    seoTitle: 'Portfolio Review',
    seoDescription: 'Get a structured portfolio review for better presentation.',
    featuredImageUrl: null,
    publishedAt,
  },
  {
    title: 'Featured Creator Placement',
    slug: 'featured-creator-placement',
    excerpt: 'Prominent homepage and explore placement for selected creators.',
    content:
      'Featured placement helps polished portfolios reach more visitors in discovery sections.',
    icon: 'star',
    sortOrder: 2,
    status: 'published',
    seoTitle: 'Featured Creator Placement',
    seoDescription: 'Promote selected creators with featured placement.',
    featuredImageUrl: null,
    publishedAt,
  },
];

const cmsFaqs = [
  {
    question: 'Can I edit CMS content from the admin panel?',
    answer:
      'Yes. Admin CMS endpoints are available for pages, posts, services and FAQs.',
    category: 'CMS',
    sortOrder: 1,
    status: 'published',
    publishedAt,
  },
  {
    question: 'Are draft pages public?',
    answer: 'No. Public CMS endpoints only return published content.',
    category: 'Publishing',
    sortOrder: 2,
    status: 'published',
    publishedAt,
  },
];

const contactSubmissions = [
  {
    name: 'Demo Visitor',
    email: 'visitor@example.com',
    subject: 'Partnership question',
    message: 'I would like to learn more about featured creator placements.',
    status: 'new',
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        status: user.status || 'active',
        password: await bcrypt.hash(user.password, 10),
      })),
    );

    const createdUsers = await User.bulkCreate(hashedUsers, {
      returning: true,
    });

    const usersByEmail = new Map(
      createdUsers.map((user) => [user.email, user]),
    );

    const portfoliosBySlug = new Map();

    for (const { ownerEmail, projects, ...portfolioData } of portfolios) {
      const owner = usersByEmail.get(ownerEmail);

      if (!owner) {
        throw new Error(`Missing owner for ${portfolioData.slug}`);
      }

      const portfolio = await Portfolio.create({
        ...portfolioData,
        userId: owner.id,
      });

      portfoliosBySlug.set(portfolio.slug, portfolio);

      await Project.bulkCreate(
        projects.map((project) => ({
          ...project,
          portfolioId: portfolio.id,
          githubUrl: project.githubUrl || null,
          liveUrl: project.liveUrl || null,
        })),
      );
    }

    await Report.bulkCreate(
      reports.map((report) => {
        const portfolio = portfoliosBySlug.get(report.portfolioSlug);
        const reporter = usersByEmail.get(report.reporterEmail);

        if (!portfolio || !reporter) {
          throw new Error(`Missing report relation for ${report.reason}`);
        }

        return {
          portfolioId: portfolio.id,
          reporterId: reporter.id,
          reason: report.reason,
          details: report.details,
          status: report.status,
          resolvedAt: report.resolvedAt || null,
        };
      }),
    );

    await Favorite.bulkCreate([
      {
        userId: usersByEmail.get('lana@example.com').id,
        portfolioId: portfoliosBySlug.get('markodev').id,
      },
      {
        userId: usersByEmail.get('marko@example.com').id,
        portfolioId: portfoliosBySlug.get('lana.design').id,
      },
      {
        userId: usersByEmail.get('mila@example.com').id,
        portfolioId: portfoliosBySlug.get('markodev').id,
      },
    ]);

    await RecentView.bulkCreate([
      {
        userId: usersByEmail.get('marko@example.com').id,
        portfolioId: portfoliosBySlug.get('lana.design').id,
        viewedAt: new Date(),
      },
      {
        userId: usersByEmail.get('marko@example.com').id,
        portfolioId: portfoliosBySlug.get('mila.mobile').id,
        viewedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
      },
    ]);

    await Comment.bulkCreate([
      {
        userId: usersByEmail.get('lana@example.com').id,
        portfolioId: portfoliosBySlug.get('markodev').id,
        projectId: null,
        body: 'Great backend structure and clean project presentation.',
      },
      {
        userId: usersByEmail.get('marko@example.com').id,
        portfolioId: portfoliosBySlug.get('lana.design').id,
        projectId: null,
        body: 'Beautiful visual system and clear case study flow.',
      },
    ]);

    await Notification.bulkCreate([
      {
        userId: usersByEmail.get('marko@example.com').id,
        type: 'portfolio_liked',
        message: 'Lana saved your portfolio',
        metadata: { portfolioId: portfoliosBySlug.get('markodev').id },
      },
      {
        userId: usersByEmail.get('sara@example.com').id,
        type: 'portfolio_approved',
        message: 'Your portfolio is waiting for admin review',
        metadata: { portfolioId: portfoliosBySlug.get('saranovak').id },
      },
    ]);

    const analyticsEvents = [];
    for (const portfolio of portfoliosBySlug.values()) {
      for (let index = 0; index < 12; index += 1) {
        analyticsEvents.push({
          userId: null,
          portfolioId: portfolio.id,
          projectId: null,
          type: 'portfolio_view',
          createdAt: new Date(Date.now() - index * 1000 * 60 * 60 * 24),
          updatedAt: new Date(Date.now() - index * 1000 * 60 * 60 * 24),
        });
      }
    }

    await AnalyticsEvent.bulkCreate(analyticsEvents);

    await CmsPage.bulkCreate(cmsPages);
    await CmsPost.bulkCreate(cmsPosts);
    await CmsService.bulkCreate(cmsServices);
    await CmsFaq.bulkCreate(cmsFaqs);
    await ContactSubmission.bulkCreate(contactSubmissions);

    console.log('Database seeded successfully.');
    console.log('Admin login: admin@portify.com / admin123');
    console.log('Moderator login: moderator@portify.com / moderator123');
    console.log('User login: marko@example.com / user123');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

void seed();
