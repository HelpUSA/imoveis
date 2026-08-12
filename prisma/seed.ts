import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed with map coordinates...');

  // Clean existing data
  await prisma.favorite.deleteMany();
  await prisma.leadInquiry.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('123456', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // 1. Create Admin / Developer
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Desenvolvedor',
      email: 'admin@imoveis.com',
      password: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      phone: '(83) 99999-0000',
      whatsapp: '5583999990000',
      bio: 'Administrador geral da plataforma guarda-chuva de corretores de imóveis.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  });

  // 2. Create Realtor Waleska (Broker)
  const waleska = await prisma.user.create({
    data: {
      name: 'Waleska Corretora',
      email: 'waleska@imoveis.com',
      password: defaultPasswordHash,
      role: 'CORRETOR',
      status: 'ACTIVE',
      creci: 'CRECI 8492-F PB',
      agencyName: 'Waleska Imóveis Luxo',
      phone: '(83) 99823-4567',
      whatsapp: '5583998234567',
      bio: 'Especialista em imóveis de alto padrão e cobertura na beira-mar de João Pessoa (Cabo Branco, Altiplano, Tambaú e Manaíra). Atendimento personalizado com discrição e excelência.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    },
  });

  // 3. Create Realtor 2 (Carlos Prime)
  const carlos = await prisma.user.create({
    data: {
      name: 'Carlos Eduardo Prime',
      email: 'carlos@imoveis.com',
      password: defaultPasswordHash,
      role: 'CORRETOR',
      status: 'ACTIVE',
      creci: 'CRECI 11420-F PB',
      agencyName: 'Prime Select Real Estate',
      phone: '(83) 98765-4321',
      whatsapp: '5583987654321',
      bio: 'Consultor imobiliário focado em residências exclusivas, mansões em condomínio fechado e lançamentos de alto investimento.',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    },
  });

  // 4. Create Client / Buyer User
  const cliente = await prisma.user.create({
    data: {
      name: 'Lucas Silva (Comprador)',
      email: 'cliente@imoveis.com',
      password: defaultPasswordHash,
      role: 'CLIENT',
      status: 'ACTIVE',
      phone: '(83) 99111-2233',
      whatsapp: '5583991112233',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    },
  });

  console.log('👤 Users created successfully.');

  // 5. Seed Properties with Map Coordinates
  const propertiesData = [
    {
      title: 'Mansão Beira-Mar Cabo Branco com Piscina Infinita',
      slug: 'mansao-beira-mar-cabo-branco',
      description: 'Espetacular residência em localização privilegiada na beira-mar de Cabo Branco. Projeto arquitetônico assinado com acabamentos importados em mármore italiano, automação residencial completa, conceito aberto com vista panorâmica para o oceano, piscina com borda infinita, espaço gourmet integrado, adega climatizada e suíte máster de 90m² com hidromassagem dupla.',
      price: 4850000,
      rentPrice: 28000,
      transactionType: 'BOTH',
      propertyType: 'HOUSE',
      address: 'Av. Cabo Branco, 2400',
      neighborhood: 'Cabo Branco',
      city: 'João Pessoa',
      state: 'PB',
      zipCode: '58045-010',
      latitude: -7.1264,
      longitude: -34.8219,
      bedrooms: 5,
      bathrooms: 6,
      suites: 5,
      parkingSpaces: 4,
      areaTotal: 580,
      areaBuilt: 520,
      condoFee: 1800,
      iptuFee: 4200,
      featured: true,
      status: 'AVAILABLE',
      viewsCount: 342,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      ]),
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      virtualTourUrl: 'https://my.matterport.com/show/?m=sample',
      amenities: JSON.stringify(['Vista para o Mar', 'Piscina com Borda Infinita', 'Varanda Gourmet', 'Automação Residencial', 'Adega Climatizada', 'Portaria 24h', 'Gerador Full', 'Móveis Planejados']),
      realtorId: waleska.id,
    },
    {
      title: 'Cobertura Duplex Penthouse no Altiplano',
      slug: 'cobertura-duplex-penthouse-altiplano',
      description: 'Cobertura exclusiva no andar mais alto do Altiplano Nobre. Terraço privativo com jacuzzi aquecida, espaço gourmet com churrasqueira a gás e chopeira instalada, sala com pé-direito duplo, 4 vagas cobertas independentes e vista livre 360° para a mata e o mar.',
      price: 3200000,
      rentPrice: null,
      transactionType: 'SALE',
      propertyType: 'PENTHOUSE',
      address: 'R. Poeta Luiz Raimundo Baptista de Carvalho',
      neighborhood: 'Altiplano',
      city: 'João Pessoa',
      state: 'PB',
      zipCode: '58046-000',
      latitude: -7.1415,
      longitude: -34.8188,
      bedrooms: 4,
      bathrooms: 5,
      suites: 4,
      parkingSpaces: 4,
      areaTotal: 410,
      areaBuilt: 390,
      condoFee: 2100,
      iptuFee: 3100,
      featured: true,
      status: 'AVAILABLE',
      viewsCount: 219,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      ]),
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      virtualTourUrl: null,
      amenities: JSON.stringify(['Jacuzzi Privativa', 'Espaço Gourmet', 'Pé Direito Duplo', 'Vista 360 Graus', 'Academia de Alto Padrão', 'Quadra de Tênis', 'Cinema Privativo']),
      realtorId: waleska.id,
    },
    {
      title: 'Apartamento Design 3 Suítes na Quadra do Mar em Manaíra',
      slug: 'apartamento-design-manaira',
      description: 'Apartamento finamente decorado por arquiteto renomado. Totalmente mobiliado com móveis assinados, iluminação em LED com cenários pré-programados, varanda com cortina de vidro e integração completa com a cozinha gourmet.',
      price: 1650000,
      rentPrice: 11000,
      transactionType: 'BOTH',
      propertyType: 'APARTMENT',
      address: 'Av. General Edson Ramalho, 890',
      neighborhood: 'Manaíra',
      city: 'João Pessoa',
      state: 'PB',
      zipCode: '58038-100',
      latitude: -7.1082,
      longitude: -34.8329,
      bedrooms: 3,
      bathrooms: 4,
      suites: 3,
      parkingSpaces: 2,
      areaTotal: 165,
      areaBuilt: 165,
      condoFee: 950,
      iptuFee: 1800,
      featured: true,
      status: 'AVAILABLE',
      viewsCount: 185,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      ]),
      videoUrl: null,
      virtualTourUrl: null,
      amenities: JSON.stringify(['Mobiliado e Decorado', 'Varanda Integrada', 'Portaria Virtual 24h', 'Piscina Aquecida', 'Salão de Festas']),
      realtorId: waleska.id,
    },
    {
      title: 'Casa Contemporânea em Condomínio Fechado Alphaville',
      slug: 'casa-contemporanea-alphaville',
      description: 'Residência moderna com linhas retas e paisagismo exuberante. Ampla sala de estar com integração para área de lazer privativa, churrasqueira, deck molhado, energia solar instalada e reservatório de água subterrâneo.',
      price: 2750000,
      rentPrice: null,
      transactionType: 'SALE',
      propertyType: 'HOUSE',
      address: 'Condomínio Alphaville, Quadra C',
      neighborhood: 'Bessa',
      city: 'João Pessoa',
      state: 'PB',
      zipCode: '58035-200',
      latitude: -7.0789,
      longitude: -34.8344,
      bedrooms: 4,
      bathrooms: 5,
      suites: 4,
      parkingSpaces: 3,
      areaTotal: 450,
      areaBuilt: 380,
      condoFee: 1200,
      iptuFee: 2400,
      featured: false,
      status: 'AVAILABLE',
      viewsCount: 140,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      ]),
      videoUrl: null,
      virtualTourUrl: null,
      amenities: JSON.stringify(['Condomínio Fechado', 'Energia Solar', 'Piscina Privativa', 'Segurança 24h', 'Quadra Poliesportiva', 'Playground']),
      realtorId: carlos.id,
    },
    {
      title: 'Loja Comercial Prime na Av. Epitácio Pessoa',
      slug: 'loja-comercial-epitacio-pessoa',
      description: 'Ponto comercial estratégico com alto fluxo de veículos e pedestres. Fachada envidraçada de 15 metros, pé-direito de 6m possibilitando mezanino, 10 vagas rotativas para clientes e infraestrutura completa para banco, clínica ou franquia de grande porte.',
      price: 3900000,
      rentPrice: 22000,
      transactionType: 'BOTH',
      propertyType: 'COMMERCIAL',
      address: 'Av. Presidente Epitácio Pessoa, 1500',
      neighborhood: 'Tambaú',
      city: 'João Pessoa',
      state: 'PB',
      zipCode: '58039-000',
      latitude: -7.1189,
      longitude: -34.8260,
      bedrooms: 0,
      bathrooms: 4,
      suites: 0,
      parkingSpaces: 10,
      areaTotal: 500,
      areaBuilt: 500,
      condoFee: 0,
      iptuFee: 5000,
      featured: false,
      status: 'AVAILABLE',
      viewsCount: 95,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
      ]),
      videoUrl: null,
      virtualTourUrl: null,
      amenities: JSON.stringify(['Estacionamento Próprio', 'Fachada de Vidro', 'Acessibilidade PCD', 'Localização Estratégica', 'Ar Condicionado Central']),
      realtorId: carlos.id,
    },
  ];

  for (const prop of propertiesData) {
    await prisma.property.create({ data: prop });
  }

  console.log('🏡 Properties with coordinates created successfully.');

  // Create sample lead
  const firstProperty = await prisma.property.findFirst({ where: { slug: 'mansao-beira-mar-cabo-branco' } });
  if (firstProperty) {
    await prisma.leadInquiry.create({
      data: {
        propertyId: firstProperty.id,
        realtorId: waleska.id,
        clientName: 'Roberto Albuquerque',
        clientEmail: 'roberto@email.com',
        clientPhone: '(83) 99888-1122',
        message: 'Olá Waleska! Gostaria de agendar uma visita presencial nesta mansão em Cabo Branco ainda esta semana. Qual sua disponibilidade?',
        status: 'NEW',
      },
    });

    await prisma.favorite.create({
      data: {
        userId: cliente.id,
        propertyId: firstProperty.id,
      },
    });
  }

  console.log('🎉 Database seeding with coordinates completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
