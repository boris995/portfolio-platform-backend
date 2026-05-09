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
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    tableName: 'users',
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
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.STRING(120),
      allowNull: false,
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
    location: {
      type: DataTypes.STRING(140),
      allowNull: false,
      defaultValue: '',
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200',
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    skills: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    projectsCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    followers: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    views: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
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
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    github: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'portfolios',
  },
);

User.hasMany(Portfolio, {
  foreignKey: 'userId',
  as: 'portfolios',
});

Portfolio.belongsTo(User, {
  foreignKey: 'userId',
  as: 'owner',
});

const users = [
  {
    name: 'Admin User',
    email: 'admin@portify.com',
    password: 'admin123',
    role: 'admin',
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
  },
];

const portfolios = [
  {
    ownerEmail: 'lana@example.com',
    name: 'Lana Petrovic',
    username: 'lana.design',
    role: 'Product Designer',
    category: 'UI/UX',
    location: 'Belgrade, Serbia',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    coverImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200',
    bio: 'Designing clean digital products with strong visual identity and smooth user experience.',
    skills: ['Figma', 'Design Systems', 'UX Research'],
    projectsCount: 14,
    followers: 1240,
    views: 18300,
    featured: true,
    status: 'approved',
    website: 'https://lana.design',
    github: null,
    linkedin: 'https://linkedin.com/in/lanadesign',
  },
  {
    ownerEmail: 'marko@example.com',
    name: 'Marko Ilic',
    username: 'markodev',
    role: 'Full Stack Developer',
    category: 'Full Stack',
    location: 'Banja Luka, BiH',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200',
    bio: 'Building scalable web apps with React, Node.js, MySQL and clean backend architecture.',
    skills: ['React', 'Node.js', 'MySQL'],
    projectsCount: 22,
    followers: 2180,
    views: 32400,
    featured: true,
    status: 'approved',
    website: 'https://markodev.dev',
    github: 'https://github.com/markodev',
    linkedin: 'https://linkedin.com/in/markodev',
  },
  {
    ownerEmail: 'sara@example.com',
    name: 'Sara Novak',
    username: 'saranovak',
    role: 'Frontend Engineer',
    category: 'Frontend',
    location: 'Zagreb, Croatia',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
    bio: 'Creating beautiful interfaces with React, animations, accessibility and performance in mind.',
    skills: ['React', 'TypeScript', 'Tailwind'],
    projectsCount: 18,
    followers: 1750,
    views: 26700,
    featured: false,
    status: 'pending',
    website: 'https://saranovak.dev',
    github: 'https://github.com/saranovak',
    linkedin: 'https://linkedin.com/in/saranovak',
  },
  {
    ownerEmail: 'nikola@example.com',
    name: 'Nikola Vasic',
    username: 'nikola.api',
    role: 'Backend Developer',
    category: 'Backend',
    location: 'Novi Sad, Serbia',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200',
    bio: 'Focused on APIs, databases, clean architecture, authentication and scalable backend systems.',
    skills: ['Express', 'Sequelize', 'PostgreSQL'],
    projectsCount: 16,
    followers: 980,
    views: 14800,
    featured: false,
    status: 'approved',
    website: 'https://nikolaapi.dev',
    github: 'https://github.com/nikolaapi',
    linkedin: 'https://linkedin.com/in/nikolaapi',
  },
  {
    ownerEmail: 'mila@example.com',
    name: 'Mila Kovac',
    username: 'mila.mobile',
    role: 'Mobile App Developer',
    category: 'Mobile',
    location: 'Sarajevo, BiH',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
    coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200',
    bio: 'Crafting smooth mobile experiences with React Native, animations and product thinking.',
    skills: ['React Native', 'Expo', 'Firebase'],
    projectsCount: 11,
    followers: 1430,
    views: 20100,
    featured: true,
    status: 'approved',
    website: 'https://milamobile.dev',
    github: 'https://github.com/milamobile',
    linkedin: 'https://linkedin.com/in/milamobile',
  },
  {
    ownerEmail: 'ivan@example.com',
    name: 'Ivan Horvat',
    username: 'ivan.cloud',
    role: 'DevOps Engineer',
    category: 'DevOps',
    location: 'Split, Croatia',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
    bio: 'Automating deployments, monitoring infrastructure and building reliable cloud workflows.',
    skills: ['Docker', 'AWS', 'CI/CD'],
    projectsCount: 9,
    followers: 760,
    views: 9900,
    featured: false,
    status: 'rejected',
    website: 'https://ivancloud.dev',
    github: 'https://github.com/ivancloud',
    linkedin: 'https://linkedin.com/in/ivancloud',
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })),
    );

    const createdUsers = await User.bulkCreate(hashedUsers, {
      returning: true,
    });

    const usersByEmail = new Map(
      createdUsers.map((user) => [user.email, user]),
    );

    await Portfolio.bulkCreate(
      portfolios.map(({ ownerEmail, ...portfolio }) => {
        const owner = usersByEmail.get(ownerEmail);

        if (!owner) {
          throw new Error(`Missing owner for ${portfolio.username}`);
        }

        return {
          ...portfolio,
          userId: owner.id,
        };
      }),
    );

    console.log('Database seeded successfully.');
    console.log('Admin login: admin@portify.com / admin123');
    console.log('User login: marko@example.com / user123');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seed();
