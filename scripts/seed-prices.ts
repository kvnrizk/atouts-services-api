import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PriceReferencesService } from '../src/price-references/price-references.service';

/**
 * Seed script for price reference data (~150 items across 5 categories)
 * Usage: npm run seed:prices
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const priceReferencesService = app.get(PriceReferencesService);

  console.log('\n=== Seeding Price References ===\n');

  const priceData = [
    // ========================================
    // PEINTURE (30 items)
    // ========================================
    { category: 'peinture', workItem: 'murs_1_couche', label: 'Peinture murs - 1 couche', unit: 'm2', priceLow: 15, priceMid: 22, priceHigh: 32, sortOrder: 1 },
    { category: 'peinture', workItem: 'murs_2_couches', label: 'Peinture murs - 2 couches', unit: 'm2', priceLow: 22, priceMid: 30, priceHigh: 45, sortOrder: 2 },
    { category: 'peinture', workItem: 'plafond', label: 'Peinture plafond', unit: 'm2', priceLow: 18, priceMid: 28, priceHigh: 40, sortOrder: 3 },
    { category: 'peinture', workItem: 'boiseries', label: 'Peinture boiseries (portes, plinthes)', unit: 'ml', priceLow: 12, priceMid: 18, priceHigh: 28, sortOrder: 4 },
    { category: 'peinture', workItem: 'preparation_surfaces', label: 'Preparation des surfaces (enduit, poncage)', unit: 'm2', priceLow: 8, priceMid: 15, priceHigh: 25, sortOrder: 5 },
    { category: 'peinture', workItem: 'ravalement', label: 'Ravalement de facade', unit: 'm2', priceLow: 40, priceMid: 60, priceHigh: 90, sortOrder: 6 },
    { category: 'peinture', workItem: 'sous_couche', label: 'Application sous-couche / primaire', unit: 'm2', priceLow: 6, priceMid: 10, priceHigh: 16, sortOrder: 7 },
    { category: 'peinture', workItem: 'peinture_porte', label: 'Peinture porte (2 faces)', unit: 'unite', priceLow: 80, priceMid: 120, priceHigh: 180, sortOrder: 8 },
    { category: 'peinture', workItem: 'peinture_fenetre', label: 'Peinture fenetre / encadrement', unit: 'unite', priceLow: 60, priceMid: 90, priceHigh: 140, sortOrder: 9 },
    { category: 'peinture', workItem: 'peinture_radiateur', label: 'Peinture radiateur', unit: 'unite', priceLow: 40, priceMid: 65, priceHigh: 100, sortOrder: 10 },
    { category: 'peinture', workItem: 'peinture_decorative', label: 'Peinture decorative / effet (stucco, beton cire)', unit: 'm2', priceLow: 35, priceMid: 55, priceHigh: 90, sortOrder: 11 },
    { category: 'peinture', workItem: 'papier_peint_depose', label: 'Depose papier peint', unit: 'm2', priceLow: 5, priceMid: 10, priceHigh: 18, sortOrder: 12 },
    { category: 'peinture', workItem: 'papier_peint_pose', label: 'Pose papier peint (fourniture incluse)', unit: 'm2', priceLow: 20, priceMid: 35, priceHigh: 60, sortOrder: 13 },
    { category: 'peinture', workItem: 'enduit_decoratif', label: 'Enduit decoratif (tadelakt, chaux)', unit: 'm2', priceLow: 40, priceMid: 65, priceHigh: 100, sortOrder: 14 },
    { category: 'peinture', workItem: 'lessivage_murs', label: 'Lessivage des murs', unit: 'm2', priceLow: 3, priceMid: 5, priceHigh: 8, sortOrder: 15 },
    { category: 'peinture', workItem: 'rebouchage_fissures', label: 'Rebouchage fissures et trous', unit: 'forfait', priceLow: 80, priceMid: 150, priceHigh: 250, sortOrder: 16 },
    { category: 'peinture', workItem: 'enduit_lissage', label: 'Enduit de lissage complet', unit: 'm2', priceLow: 12, priceMid: 20, priceHigh: 30, sortOrder: 17 },
    { category: 'peinture', workItem: 'peinture_cage_escalier', label: 'Peinture cage d\'escalier', unit: 'm2', priceLow: 25, priceMid: 40, priceHigh: 60, sortOrder: 18 },
    { category: 'peinture', workItem: 'peinture_sol', label: 'Peinture sol (garage, cave)', unit: 'm2', priceLow: 18, priceMid: 28, priceHigh: 42, sortOrder: 19 },
    { category: 'peinture', workItem: 'traitement_humidite', label: 'Traitement anti-humidite avant peinture', unit: 'm2', priceLow: 15, priceMid: 25, priceHigh: 40, sortOrder: 20 },
    { category: 'peinture', workItem: 'peinture_volets', label: 'Peinture volets (par paire)', unit: 'unite', priceLow: 60, priceMid: 100, priceHigh: 160, sortOrder: 21 },
    { category: 'peinture', workItem: 'peinture_grille_portail', label: 'Peinture grille / portail metallique', unit: 'forfait', priceLow: 150, priceMid: 250, priceHigh: 400, sortOrder: 22 },
    { category: 'peinture', workItem: 'laque_meuble', label: 'Laquage meuble ou element', unit: 'unite', priceLow: 100, priceMid: 180, priceHigh: 300, sortOrder: 23 },
    { category: 'peinture', workItem: 'peinture_anti_moisissure', label: 'Peinture anti-moisissure', unit: 'm2', priceLow: 20, priceMid: 30, priceHigh: 45, sortOrder: 24 },
    { category: 'peinture', workItem: 'protection_chantier', label: 'Protection chantier (baches, masquage)', unit: 'forfait', priceLow: 80, priceMid: 150, priceHigh: 250, sortOrder: 25 },
    { category: 'peinture', workItem: 'nettoyage_fin_chantier', label: 'Nettoyage fin de chantier', unit: 'forfait', priceLow: 100, priceMid: 200, priceHigh: 350, sortOrder: 26 },
    { category: 'peinture', workItem: 'vernis_parquet', label: 'Vernis / vitrification parquet', unit: 'm2', priceLow: 15, priceMid: 25, priceHigh: 40, sortOrder: 27 },
    { category: 'peinture', workItem: 'lasure_bois', label: 'Lasure bois exterieur', unit: 'm2', priceLow: 12, priceMid: 20, priceHigh: 32, sortOrder: 28 },
    { category: 'peinture', workItem: 'peinture_plafond_decoratif', label: 'Plafond decoratif (moulures, staff)', unit: 'm2', priceLow: 30, priceMid: 50, priceHigh: 80, sortOrder: 29 },
    { category: 'peinture', workItem: 'crepis_exterieur', label: 'Crepis exterieur', unit: 'm2', priceLow: 35, priceMid: 55, priceHigh: 85, sortOrder: 30 },

    // ========================================
    // RENOVATION (30 items)
    // ========================================
    { category: 'renovation', workItem: 'demolition', label: 'Demolition et depose', unit: 'm2', priceLow: 15, priceMid: 25, priceHigh: 40, sortOrder: 1 },
    { category: 'renovation', workItem: 'cloisons_placo', label: 'Cloisons en placo (fourniture + pose)', unit: 'm2', priceLow: 35, priceMid: 50, priceHigh: 70, sortOrder: 2 },
    { category: 'renovation', workItem: 'enduits', label: 'Enduits et lissage', unit: 'm2', priceLow: 12, priceMid: 20, priceHigh: 30, sortOrder: 3 },
    { category: 'renovation', workItem: 'cuisine_amenagee', label: 'Cuisine amenagee complete', unit: 'forfait', priceLow: 5000, priceMid: 8000, priceHigh: 15000, sortOrder: 4 },
    { category: 'renovation', workItem: 'ouverture_mur', label: 'Ouverture mur porteur (IPN)', unit: 'forfait', priceLow: 2500, priceMid: 4000, priceHigh: 6000, sortOrder: 5 },
    { category: 'renovation', workItem: 'gestion_dechets', label: 'Evacuation et gestion des dechets', unit: 'forfait', priceLow: 300, priceMid: 600, priceHigh: 1000, sortOrder: 6 },
    { category: 'renovation', workItem: 'faux_plafond', label: 'Faux plafond (placo sur ossature)', unit: 'm2', priceLow: 35, priceMid: 55, priceHigh: 80, sortOrder: 7 },
    { category: 'renovation', workItem: 'isolation_murs_interieur', label: 'Isolation murs par l\'interieur', unit: 'm2', priceLow: 30, priceMid: 50, priceHigh: 75, sortOrder: 8 },
    { category: 'renovation', workItem: 'isolation_combles', label: 'Isolation combles perdus', unit: 'm2', priceLow: 20, priceMid: 35, priceHigh: 55, sortOrder: 9 },
    { category: 'renovation', workItem: 'isolation_plancher', label: 'Isolation plancher bas', unit: 'm2', priceLow: 25, priceMid: 40, priceHigh: 60, sortOrder: 10 },
    { category: 'renovation', workItem: 'porte_interieure', label: 'Remplacement porte interieure (bloc-porte)', unit: 'unite', priceLow: 250, priceMid: 400, priceHigh: 650, sortOrder: 11 },
    { category: 'renovation', workItem: 'porte_entree', label: 'Remplacement porte d\'entree', unit: 'unite', priceLow: 800, priceMid: 1500, priceHigh: 2500, sortOrder: 12 },
    { category: 'renovation', workItem: 'fenetre_pvc', label: 'Remplacement fenetre PVC double vitrage', unit: 'unite', priceLow: 400, priceMid: 650, priceHigh: 1000, sortOrder: 13 },
    { category: 'renovation', workItem: 'fenetre_alu', label: 'Remplacement fenetre aluminium', unit: 'unite', priceLow: 600, priceMid: 900, priceHigh: 1400, sortOrder: 14 },
    { category: 'renovation', workItem: 'placard_sur_mesure', label: 'Placard / dressing sur mesure', unit: 'ml', priceLow: 400, priceMid: 700, priceHigh: 1200, sortOrder: 15 },
    { category: 'renovation', workItem: 'escalier_renovation', label: 'Renovation escalier (habillage)', unit: 'forfait', priceLow: 1500, priceMid: 3000, priceHigh: 5500, sortOrder: 16 },
    { category: 'renovation', workItem: 'chape_beton', label: 'Chape beton / ragreage epais', unit: 'm2', priceLow: 20, priceMid: 35, priceHigh: 55, sortOrder: 17 },
    { category: 'renovation', workItem: 'vmc_simple', label: 'VMC simple flux', unit: 'forfait', priceLow: 400, priceMid: 700, priceHigh: 1100, sortOrder: 18 },
    { category: 'renovation', workItem: 'vmc_double', label: 'VMC double flux', unit: 'forfait', priceLow: 2000, priceMid: 3500, priceHigh: 5500, sortOrder: 19 },
    { category: 'renovation', workItem: 'plomberie_alimentation', label: 'Refection alimentation eau (cuivre/PER)', unit: 'forfait', priceLow: 800, priceMid: 1500, priceHigh: 2500, sortOrder: 20 },
    { category: 'renovation', workItem: 'plomberie_evacuation', label: 'Refection evacuation PVC', unit: 'forfait', priceLow: 600, priceMid: 1000, priceHigh: 1800, sortOrder: 21 },
    { category: 'renovation', workItem: 'chauffage_radiateur', label: 'Remplacement radiateur (fourniture + pose)', unit: 'unite', priceLow: 300, priceMid: 500, priceHigh: 900, sortOrder: 22 },
    { category: 'renovation', workItem: 'cloison_verriere', label: 'Cloison verriere atelier', unit: 'ml', priceLow: 400, priceMid: 700, priceHigh: 1100, sortOrder: 23 },
    { category: 'renovation', workItem: 'garde_corps', label: 'Garde-corps / rambarde (metal)', unit: 'ml', priceLow: 150, priceMid: 250, priceHigh: 400, sortOrder: 24 },
    { category: 'renovation', workItem: 'coffrage_tuyaux', label: 'Coffrage tuyaux / gaines', unit: 'ml', priceLow: 30, priceMid: 50, priceHigh: 80, sortOrder: 25 },
    { category: 'renovation', workItem: 'depose_moquette', label: 'Depose moquette / revetement ancien', unit: 'm2', priceLow: 5, priceMid: 10, priceHigh: 18, sortOrder: 26 },
    { category: 'renovation', workItem: 'traitement_amiante', label: 'Diagnostic et traitement amiante', unit: 'forfait', priceLow: 500, priceMid: 1000, priceHigh: 2000, sortOrder: 27 },
    { category: 'renovation', workItem: 'moulures_corniches', label: 'Restauration moulures / corniches', unit: 'ml', priceLow: 25, priceMid: 45, priceHigh: 80, sortOrder: 28 },
    { category: 'renovation', workItem: 'renovation_complete_m2', label: 'Renovation complete (prix global au m2)', unit: 'm2', priceLow: 600, priceMid: 900, priceHigh: 1500, sortOrder: 29 },
    { category: 'renovation', workItem: 'maitrise_ouvrage', label: 'Maitrise d\'ouvrage / coordination', unit: 'forfait', priceLow: 500, priceMid: 1000, priceHigh: 2000, sortOrder: 30 },

    // ========================================
    // ELECTRICITE (30 items)
    // ========================================
    { category: 'electricite', workItem: 'point_lumineux', label: 'Point lumineux (fourniture + pose)', unit: 'unite', priceLow: 80, priceMid: 120, priceHigh: 180, sortOrder: 1 },
    { category: 'electricite', workItem: 'prise_electrique', label: 'Prise electrique (fourniture + pose)', unit: 'unite', priceLow: 60, priceMid: 90, priceHigh: 140, sortOrder: 2 },
    { category: 'electricite', workItem: 'interrupteur', label: 'Interrupteur (fourniture + pose)', unit: 'unite', priceLow: 50, priceMid: 80, priceHigh: 120, sortOrder: 3 },
    { category: 'electricite', workItem: 'tableau_electrique', label: 'Tableau electrique complet', unit: 'forfait', priceLow: 800, priceMid: 1200, priceHigh: 2000, sortOrder: 4 },
    { category: 'electricite', workItem: 'mise_aux_normes', label: 'Mise aux normes NFC 15-100', unit: 'forfait', priceLow: 2000, priceMid: 3500, priceHigh: 5500, sortOrder: 5 },
    { category: 'electricite', workItem: 'cablage_reseau', label: 'Cablage reseau / domotique', unit: 'unite', priceLow: 100, priceMid: 180, priceHigh: 300, sortOrder: 6 },
    { category: 'electricite', workItem: 'spot_led_encastre', label: 'Spot LED encastre (fourniture + pose)', unit: 'unite', priceLow: 60, priceMid: 90, priceHigh: 140, sortOrder: 7 },
    { category: 'electricite', workItem: 'bandeau_led', label: 'Bandeau LED avec alimentation', unit: 'ml', priceLow: 25, priceMid: 40, priceHigh: 65, sortOrder: 8 },
    { category: 'electricite', workItem: 'lustre_pose', label: 'Pose lustre / suspension', unit: 'unite', priceLow: 40, priceMid: 70, priceHigh: 120, sortOrder: 9 },
    { category: 'electricite', workItem: 'prise_usb', label: 'Prise avec chargeur USB integre', unit: 'unite', priceLow: 70, priceMid: 110, priceHigh: 160, sortOrder: 10 },
    { category: 'electricite', workItem: 'prise_exterieure', label: 'Prise exterieure etanche', unit: 'unite', priceLow: 80, priceMid: 130, priceHigh: 200, sortOrder: 11 },
    { category: 'electricite', workItem: 'interrupteur_variateur', label: 'Variateur d\'intensite', unit: 'unite', priceLow: 70, priceMid: 110, priceHigh: 170, sortOrder: 12 },
    { category: 'electricite', workItem: 'interrupteur_connecte', label: 'Interrupteur connecte (domotique)', unit: 'unite', priceLow: 100, priceMid: 160, priceHigh: 250, sortOrder: 13 },
    { category: 'electricite', workItem: 'detecteur_mouvement', label: 'Detecteur de mouvement', unit: 'unite', priceLow: 50, priceMid: 80, priceHigh: 130, sortOrder: 14 },
    { category: 'electricite', workItem: 'detecteur_fumee', label: 'Detecteur de fumee (norme NF)', unit: 'unite', priceLow: 25, priceMid: 45, priceHigh: 80, sortOrder: 15 },
    { category: 'electricite', workItem: 'visiophone', label: 'Visiophone / interphone', unit: 'forfait', priceLow: 300, priceMid: 550, priceHigh: 900, sortOrder: 16 },
    { category: 'electricite', workItem: 'volet_roulant_electrique', label: 'Volet roulant electrique', unit: 'unite', priceLow: 350, priceMid: 550, priceHigh: 900, sortOrder: 17 },
    { category: 'electricite', workItem: 'motorisation_volet', label: 'Motorisation volet existant', unit: 'unite', priceLow: 200, priceMid: 350, priceHigh: 550, sortOrder: 18 },
    { category: 'electricite', workItem: 'chauffage_electrique', label: 'Radiateur electrique (pose + raccordement)', unit: 'unite', priceLow: 200, priceMid: 350, priceHigh: 600, sortOrder: 19 },
    { category: 'electricite', workItem: 'plancher_chauffant_elec', label: 'Plancher chauffant electrique', unit: 'm2', priceLow: 40, priceMid: 65, priceHigh: 100, sortOrder: 20 },
    { category: 'electricite', workItem: 'seche_serviettes', label: 'Seche-serviettes electrique (pose)', unit: 'unite', priceLow: 150, priceMid: 250, priceHigh: 400, sortOrder: 21 },
    { category: 'electricite', workItem: 'colonne_electrique', label: 'Renovation colonne montante', unit: 'forfait', priceLow: 1000, priceMid: 2000, priceHigh: 3500, sortOrder: 22 },
    { category: 'electricite', workItem: 'terre_mise_en_place', label: 'Mise a la terre', unit: 'forfait', priceLow: 200, priceMid: 400, priceHigh: 700, sortOrder: 23 },
    { category: 'electricite', workItem: 'gaine_encastrement', label: 'Passage gaines en encastre', unit: 'ml', priceLow: 8, priceMid: 15, priceHigh: 25, sortOrder: 24 },
    { category: 'electricite', workItem: 'eclairage_exterieur', label: 'Eclairage exterieur / jardin', unit: 'unite', priceLow: 100, priceMid: 180, priceHigh: 300, sortOrder: 25 },
    { category: 'electricite', workItem: 'borne_recharge_ve', label: 'Borne de recharge vehicule electrique', unit: 'forfait', priceLow: 1200, priceMid: 1800, priceHigh: 2800, sortOrder: 26 },
    { category: 'electricite', workItem: 'alarme_intrusion', label: 'Systeme d\'alarme intrusion', unit: 'forfait', priceLow: 500, priceMid: 900, priceHigh: 1500, sortOrder: 27 },
    { category: 'electricite', workItem: 'camera_surveillance', label: 'Camera de surveillance (fourniture + pose)', unit: 'unite', priceLow: 150, priceMid: 250, priceHigh: 450, sortOrder: 28 },
    { category: 'electricite', workItem: 'prise_cuisine_plan', label: 'Prise plan de travail cuisine', unit: 'unite', priceLow: 80, priceMid: 120, priceHigh: 180, sortOrder: 29 },
    { category: 'electricite', workItem: 'disjoncteur_diff', label: 'Disjoncteur differentiel 30mA', unit: 'unite', priceLow: 60, priceMid: 100, priceHigh: 160, sortOrder: 30 },

    // ========================================
    // SALLES DE BAINS (30 items)
    // ========================================
    { category: 'salles-de-bains', workItem: 'carrelage_murs', label: 'Carrelage mural (fourniture + pose)', unit: 'm2', priceLow: 50, priceMid: 75, priceHigh: 120, sortOrder: 1 },
    { category: 'salles-de-bains', workItem: 'carrelage_sol', label: 'Carrelage sol (fourniture + pose)', unit: 'm2', priceLow: 45, priceMid: 70, priceHigh: 110, sortOrder: 2 },
    { category: 'salles-de-bains', workItem: 'plomberie', label: 'Plomberie complete (alimentation + evacuation)', unit: 'forfait', priceLow: 1500, priceMid: 2500, priceHigh: 4000, sortOrder: 3 },
    { category: 'salles-de-bains', workItem: 'douche_italienne', label: 'Douche a l\'italienne', unit: 'forfait', priceLow: 2000, priceMid: 3500, priceHigh: 5500, sortOrder: 4 },
    { category: 'salles-de-bains', workItem: 'meuble_vasque', label: 'Meuble vasque (fourniture + pose)', unit: 'forfait', priceLow: 500, priceMid: 1000, priceHigh: 2000, sortOrder: 5 },
    { category: 'salles-de-bains', workItem: 'wc', label: 'WC (fourniture + pose)', unit: 'forfait', priceLow: 400, priceMid: 700, priceHigh: 1200, sortOrder: 6 },
    { category: 'salles-de-bains', workItem: 'baignoire', label: 'Baignoire (fourniture + pose)', unit: 'forfait', priceLow: 600, priceMid: 1200, priceHigh: 2500, sortOrder: 7 },
    { category: 'salles-de-bains', workItem: 'baignoire_balneo', label: 'Baignoire balneo', unit: 'forfait', priceLow: 2000, priceMid: 3500, priceHigh: 6000, sortOrder: 8 },
    { category: 'salles-de-bains', workItem: 'cabine_douche', label: 'Cabine de douche complete', unit: 'forfait', priceLow: 800, priceMid: 1500, priceHigh: 2800, sortOrder: 9 },
    { category: 'salles-de-bains', workItem: 'paroi_douche', label: 'Paroi de douche vitree', unit: 'forfait', priceLow: 300, priceMid: 550, priceHigh: 900, sortOrder: 10 },
    { category: 'salles-de-bains', workItem: 'robinetterie_lavabo', label: 'Robinetterie lavabo (fourniture + pose)', unit: 'unite', priceLow: 80, priceMid: 150, priceHigh: 300, sortOrder: 11 },
    { category: 'salles-de-bains', workItem: 'robinetterie_douche', label: 'Robinetterie douche / mitigeur thermostatique', unit: 'unite', priceLow: 150, priceMid: 280, priceHigh: 500, sortOrder: 12 },
    { category: 'salles-de-bains', workItem: 'colonne_douche', label: 'Colonne de douche', unit: 'unite', priceLow: 200, priceMid: 350, priceHigh: 600, sortOrder: 13 },
    { category: 'salles-de-bains', workItem: 'wc_suspendu', label: 'WC suspendu avec bati-support', unit: 'forfait', priceLow: 600, priceMid: 1000, priceHigh: 1800, sortOrder: 14 },
    { category: 'salles-de-bains', workItem: 'miroir_retro_eclaire', label: 'Miroir retroeclaire (LED)', unit: 'unite', priceLow: 150, priceMid: 300, priceHigh: 550, sortOrder: 15 },
    { category: 'salles-de-bains', workItem: 'seche_serviettes', label: 'Seche-serviettes (fourniture + pose)', unit: 'unite', priceLow: 200, priceMid: 350, priceHigh: 600, sortOrder: 16 },
    { category: 'salles-de-bains', workItem: 'etancheite', label: 'Etancheite sous carrelage (SPEC)', unit: 'm2', priceLow: 15, priceMid: 25, priceHigh: 40, sortOrder: 17 },
    { category: 'salles-de-bains', workItem: 'depose_ancienne', label: 'Depose ancienne salle de bains', unit: 'forfait', priceLow: 400, priceMid: 700, priceHigh: 1200, sortOrder: 18 },
    { category: 'salles-de-bains', workItem: 'faience_mosaique', label: 'Faience mosaique / listels', unit: 'm2', priceLow: 60, priceMid: 100, priceHigh: 160, sortOrder: 19 },
    { category: 'salles-de-bains', workItem: 'niche_encastree', label: 'Niche encastree dans douche', unit: 'unite', priceLow: 150, priceMid: 250, priceHigh: 400, sortOrder: 20 },
    { category: 'salles-de-bains', workItem: 'plan_vasque_pierre', label: 'Plan vasque en pierre naturelle', unit: 'forfait', priceLow: 500, priceMid: 900, priceHigh: 1600, sortOrder: 21 },
    { category: 'salles-de-bains', workItem: 'meuble_colonne', label: 'Colonne de rangement', unit: 'unite', priceLow: 200, priceMid: 400, priceHigh: 700, sortOrder: 22 },
    { category: 'salles-de-bains', workItem: 'peinture_sdb', label: 'Peinture specifique salle de bains', unit: 'm2', priceLow: 20, priceMid: 30, priceHigh: 45, sortOrder: 23 },
    { category: 'salles-de-bains', workItem: 'ventilation_sdb', label: 'Extracteur / VMC salle de bains', unit: 'forfait', priceLow: 150, priceMid: 300, priceHigh: 500, sortOrder: 24 },
    { category: 'salles-de-bains', workItem: 'porte_sdb', label: 'Porte salle de bains (hydrofuge)', unit: 'unite', priceLow: 200, priceMid: 350, priceHigh: 550, sortOrder: 25 },
    { category: 'salles-de-bains', workItem: 'renovation_complete_sdb', label: 'Renovation complete salle de bains (prix au m2)', unit: 'm2', priceLow: 800, priceMid: 1200, priceHigh: 1800, sortOrder: 26 },
    { category: 'salles-de-bains', workItem: 'accessibilite_pmr', label: 'Amenagement PMR (barre, siege, receveur extra-plat)', unit: 'forfait', priceLow: 800, priceMid: 1500, priceHigh: 2500, sortOrder: 27 },
    { category: 'salles-de-bains', workItem: 'chauffage_sol_sdb', label: 'Plancher chauffant electrique salle de bains', unit: 'm2', priceLow: 50, priceMid: 80, priceHigh: 120, sortOrder: 28 },
    { category: 'salles-de-bains', workItem: 'seuil_douche', label: 'Seuil de douche en pierre', unit: 'unite', priceLow: 60, priceMid: 100, priceHigh: 180, sortOrder: 29 },
    { category: 'salles-de-bains', workItem: 'joints_silicone', label: 'Refection joints silicone', unit: 'ml', priceLow: 5, priceMid: 10, priceHigh: 18, sortOrder: 30 },

    // ========================================
    // REVETEMENTS DE SOL (30 items)
    // ========================================
    { category: 'revetements-sol', workItem: 'parquet_massif', label: 'Parquet massif (fourniture + pose)', unit: 'm2', priceLow: 50, priceMid: 80, priceHigh: 130, sortOrder: 1 },
    { category: 'revetements-sol', workItem: 'parquet_flottant', label: 'Parquet flottant / stratifie', unit: 'm2', priceLow: 25, priceMid: 40, priceHigh: 65, sortOrder: 2 },
    { category: 'revetements-sol', workItem: 'carrelage_sol', label: 'Carrelage (fourniture + pose)', unit: 'm2', priceLow: 40, priceMid: 65, priceHigh: 100, sortOrder: 3 },
    { category: 'revetements-sol', workItem: 'pvc_vinyle', label: 'PVC / Vinyle (fourniture + pose)', unit: 'm2', priceLow: 18, priceMid: 30, priceHigh: 50, sortOrder: 4 },
    { category: 'revetements-sol', workItem: 'ragreage', label: 'Ragreage et preparation du sol', unit: 'm2', priceLow: 10, priceMid: 18, priceHigh: 28, sortOrder: 5 },
    { category: 'revetements-sol', workItem: 'plinthes', label: 'Plinthes (fourniture + pose)', unit: 'ml', priceLow: 8, priceMid: 14, priceHigh: 22, sortOrder: 6 },
    { category: 'revetements-sol', workItem: 'parquet_contrecolle', label: 'Parquet contrecolle (fourniture + pose)', unit: 'm2', priceLow: 40, priceMid: 65, priceHigh: 100, sortOrder: 7 },
    { category: 'revetements-sol', workItem: 'parquet_point_hongrie', label: 'Parquet point de Hongrie', unit: 'm2', priceLow: 70, priceMid: 110, priceHigh: 170, sortOrder: 8 },
    { category: 'revetements-sol', workItem: 'parquet_chevron', label: 'Parquet chevron / baton rompu', unit: 'm2', priceLow: 65, priceMid: 100, priceHigh: 160, sortOrder: 9 },
    { category: 'revetements-sol', workItem: 'poncage_parquet', label: 'Poncage et vitrification parquet ancien', unit: 'm2', priceLow: 20, priceMid: 35, priceHigh: 55, sortOrder: 10 },
    { category: 'revetements-sol', workItem: 'huile_parquet', label: 'Huilage parquet', unit: 'm2', priceLow: 12, priceMid: 20, priceHigh: 32, sortOrder: 11 },
    { category: 'revetements-sol', workItem: 'carrelage_imitation_bois', label: 'Carrelage imitation bois', unit: 'm2', priceLow: 45, priceMid: 70, priceHigh: 110, sortOrder: 12 },
    { category: 'revetements-sol', workItem: 'carrelage_grand_format', label: 'Carrelage grand format (60x60+)', unit: 'm2', priceLow: 55, priceMid: 85, priceHigh: 130, sortOrder: 13 },
    { category: 'revetements-sol', workItem: 'terrazzo', label: 'Terrazzo (granito)', unit: 'm2', priceLow: 80, priceMid: 130, priceHigh: 200, sortOrder: 14 },
    { category: 'revetements-sol', workItem: 'beton_cire', label: 'Beton cire au sol', unit: 'm2', priceLow: 100, priceMid: 150, priceHigh: 220, sortOrder: 15 },
    { category: 'revetements-sol', workItem: 'moquette', label: 'Moquette (fourniture + pose)', unit: 'm2', priceLow: 15, priceMid: 25, priceHigh: 45, sortOrder: 16 },
    { category: 'revetements-sol', workItem: 'jonc_de_mer', label: 'Jonc de mer / sisal', unit: 'm2', priceLow: 20, priceMid: 35, priceHigh: 55, sortOrder: 17 },
    { category: 'revetements-sol', workItem: 'lino_naturel', label: 'Linoleum naturel', unit: 'm2', priceLow: 25, priceMid: 40, priceHigh: 60, sortOrder: 18 },
    { category: 'revetements-sol', workItem: 'lvt_clipsable', label: 'LVT clipsable (dalle vinyle luxe)', unit: 'm2', priceLow: 30, priceMid: 50, priceHigh: 80, sortOrder: 19 },
    { category: 'revetements-sol', workItem: 'depose_ancien_sol', label: 'Depose ancien revetement de sol', unit: 'm2', priceLow: 5, priceMid: 10, priceHigh: 18, sortOrder: 20 },
    { category: 'revetements-sol', workItem: 'depose_carrelage', label: 'Depose carrelage ancien', unit: 'm2', priceLow: 10, priceMid: 18, priceHigh: 30, sortOrder: 21 },
    { category: 'revetements-sol', workItem: 'sous_couche_parquet', label: 'Sous-couche acoustique parquet', unit: 'm2', priceLow: 3, priceMid: 6, priceHigh: 12, sortOrder: 22 },
    { category: 'revetements-sol', workItem: 'seuil_de_porte', label: 'Seuil de porte / barre de seuil', unit: 'unite', priceLow: 15, priceMid: 30, priceHigh: 55, sortOrder: 23 },
    { category: 'revetements-sol', workItem: 'marches_escalier', label: 'Habillage marches escalier', unit: 'unite', priceLow: 40, priceMid: 70, priceHigh: 120, sortOrder: 24 },
    { category: 'revetements-sol', workItem: 'nez_de_marche', label: 'Nez de marche', unit: 'unite', priceLow: 15, priceMid: 25, priceHigh: 45, sortOrder: 25 },
    { category: 'revetements-sol', workItem: 'dalle_exterieure', label: 'Dalle exterieure / terrasse (gres)', unit: 'm2', priceLow: 45, priceMid: 75, priceHigh: 120, sortOrder: 26 },
    { category: 'revetements-sol', workItem: 'resine_sol', label: 'Resine de sol (epoxy / polyurethane)', unit: 'm2', priceLow: 50, priceMid: 80, priceHigh: 130, sortOrder: 27 },
    { category: 'revetements-sol', workItem: 'joints_carrelage', label: 'Refection joints carrelage', unit: 'm2', priceLow: 8, priceMid: 15, priceHigh: 25, sortOrder: 28 },
    { category: 'revetements-sol', workItem: 'plinthes_carrelage', label: 'Plinthes carrelage (fourniture + pose)', unit: 'ml', priceLow: 10, priceMid: 18, priceHigh: 28, sortOrder: 29 },
    { category: 'revetements-sol', workItem: 'chape_fluide', label: 'Chape fluide anhydrite', unit: 'm2', priceLow: 15, priceMid: 25, priceHigh: 40, sortOrder: 30 },
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
