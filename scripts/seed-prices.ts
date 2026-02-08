import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PriceReferencesService } from '../src/price-references/price-references.service';

/**
 * Seed script for price reference data (~30 items across 5 categories)
 * Usage: npm run seed:prices
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const priceReferencesService = app.get(PriceReferencesService);

  console.log('\n=== Seeding Price References ===\n');

  const priceData = [
    // --- Peinture ---
    { category: 'peinture', workItem: 'murs_1_couche', label: 'Peinture murs - 1 couche', unit: 'm2', priceLow: 15, priceMid: 22, priceHigh: 32, sortOrder: 1 },
    { category: 'peinture', workItem: 'murs_2_couches', label: 'Peinture murs - 2 couches', unit: 'm2', priceLow: 22, priceMid: 30, priceHigh: 45, sortOrder: 2 },
    { category: 'peinture', workItem: 'plafond', label: 'Peinture plafond', unit: 'm2', priceLow: 18, priceMid: 28, priceHigh: 40, sortOrder: 3 },
    { category: 'peinture', workItem: 'boiseries', label: 'Peinture boiseries (portes, plinthes)', unit: 'ml', priceLow: 12, priceMid: 18, priceHigh: 28, sortOrder: 4 },
    { category: 'peinture', workItem: 'preparation_surfaces', label: 'Preparation des surfaces (enduit, poncage)', unit: 'm2', priceLow: 8, priceMid: 15, priceHigh: 25, sortOrder: 5 },
    { category: 'peinture', workItem: 'ravalement', label: 'Ravalement de facade', unit: 'm2', priceLow: 40, priceMid: 60, priceHigh: 90, sortOrder: 6 },

    // --- Renovation ---
    { category: 'renovation', workItem: 'demolition', label: 'Demolition et depose', unit: 'm2', priceLow: 15, priceMid: 25, priceHigh: 40, sortOrder: 1 },
    { category: 'renovation', workItem: 'cloisons_placo', label: 'Cloisons en placo (fourniture + pose)', unit: 'm2', priceLow: 35, priceMid: 50, priceHigh: 70, sortOrder: 2 },
    { category: 'renovation', workItem: 'enduits', label: 'Enduits et lissage', unit: 'm2', priceLow: 12, priceMid: 20, priceHigh: 30, sortOrder: 3 },
    { category: 'renovation', workItem: 'cuisine_amenagee', label: 'Cuisine amenagee complete', unit: 'forfait', priceLow: 5000, priceMid: 8000, priceHigh: 15000, sortOrder: 4 },
    { category: 'renovation', workItem: 'ouverture_mur', label: 'Ouverture mur porteur (IPN)', unit: 'forfait', priceLow: 2500, priceMid: 4000, priceHigh: 6000, sortOrder: 5 },
    { category: 'renovation', workItem: 'gestion_dechets', label: 'Evacuation et gestion des dechets', unit: 'forfait', priceLow: 300, priceMid: 600, priceHigh: 1000, sortOrder: 6 },

    // --- Electricite ---
    { category: 'electricite', workItem: 'point_lumineux', label: 'Point lumineux (fourniture + pose)', unit: 'unite', priceLow: 80, priceMid: 120, priceHigh: 180, sortOrder: 1 },
    { category: 'electricite', workItem: 'prise_electrique', label: 'Prise electrique (fourniture + pose)', unit: 'unite', priceLow: 60, priceMid: 90, priceHigh: 140, sortOrder: 2 },
    { category: 'electricite', workItem: 'interrupteur', label: 'Interrupteur (fourniture + pose)', unit: 'unite', priceLow: 50, priceMid: 80, priceHigh: 120, sortOrder: 3 },
    { category: 'electricite', workItem: 'tableau_electrique', label: 'Tableau electrique complet', unit: 'forfait', priceLow: 800, priceMid: 1200, priceHigh: 2000, sortOrder: 4 },
    { category: 'electricite', workItem: 'mise_aux_normes', label: 'Mise aux normes NFC 15-100', unit: 'forfait', priceLow: 2000, priceMid: 3500, priceHigh: 5500, sortOrder: 5 },
    { category: 'electricite', workItem: 'cablage_reseau', label: 'Cablage reseau / domotique', unit: 'unite', priceLow: 100, priceMid: 180, priceHigh: 300, sortOrder: 6 },

    // --- Salles de bains ---
    { category: 'salles-de-bains', workItem: 'carrelage_murs', label: 'Carrelage mural (fourniture + pose)', unit: 'm2', priceLow: 50, priceMid: 75, priceHigh: 120, sortOrder: 1 },
    { category: 'salles-de-bains', workItem: 'carrelage_sol', label: 'Carrelage sol (fourniture + pose)', unit: 'm2', priceLow: 45, priceMid: 70, priceHigh: 110, sortOrder: 2 },
    { category: 'salles-de-bains', workItem: 'plomberie', label: 'Plomberie complete (alimentation + evacuation)', unit: 'forfait', priceLow: 1500, priceMid: 2500, priceHigh: 4000, sortOrder: 3 },
    { category: 'salles-de-bains', workItem: 'douche_italienne', label: 'Douche a l\'italienne', unit: 'forfait', priceLow: 2000, priceMid: 3500, priceHigh: 5500, sortOrder: 4 },
    { category: 'salles-de-bains', workItem: 'meuble_vasque', label: 'Meuble vasque (fourniture + pose)', unit: 'forfait', priceLow: 500, priceMid: 1000, priceHigh: 2000, sortOrder: 5 },
    { category: 'salles-de-bains', workItem: 'wc', label: 'WC (fourniture + pose)', unit: 'forfait', priceLow: 400, priceMid: 700, priceHigh: 1200, sortOrder: 6 },

    // --- Revetements de sol ---
    { category: 'revetements-sol', workItem: 'parquet_massif', label: 'Parquet massif (fourniture + pose)', unit: 'm2', priceLow: 50, priceMid: 80, priceHigh: 130, sortOrder: 1 },
    { category: 'revetements-sol', workItem: 'parquet_flottant', label: 'Parquet flottant / stratifie', unit: 'm2', priceLow: 25, priceMid: 40, priceHigh: 65, sortOrder: 2 },
    { category: 'revetements-sol', workItem: 'carrelage_sol', label: 'Carrelage (fourniture + pose)', unit: 'm2', priceLow: 40, priceMid: 65, priceHigh: 100, sortOrder: 3 },
    { category: 'revetements-sol', workItem: 'pvc_vinyle', label: 'PVC / Vinyle (fourniture + pose)', unit: 'm2', priceLow: 18, priceMid: 30, priceHigh: 50, sortOrder: 4 },
    { category: 'revetements-sol', workItem: 'ragreage', label: 'Ragreage et preparation du sol', unit: 'm2', priceLow: 10, priceMid: 18, priceHigh: 28, sortOrder: 5 },
    { category: 'revetements-sol', workItem: 'plinthes', label: 'Plinthes (fourniture + pose)', unit: 'ml', priceLow: 8, priceMid: 14, priceHigh: 22, sortOrder: 6 },
  ];

  for (const item of priceData) {
    try {
      await priceReferencesService.create(item);
      console.log(`  + ${item.category} / ${item.label}`);
    } catch (error) {
      console.error(`  x Failed: ${item.label} — ${error.message}`);
    }
  }

  console.log(`\nSeeded ${priceData.length} price references.\n`);

  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
