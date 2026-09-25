import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { TestimonialsService } from '../src/testimonials/testimonials.service';
import { BlogService } from '../src/blog/blog.service';
import { CityPagesService } from '../src/city-pages/city-pages.service';

/**
 * Seed script for Phase 2 content: testimonials, blog posts, city pages
 * Usage: npm run seed:content
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const testimonialsService = app.get(TestimonialsService);
  const blogService = app.get(BlogService);
  const cityPagesService = app.get(CityPagesService);

  console.log('\n=== Seeding Content ===\n');

  // --- Testimonials ---
  const testimonials = [
    {
      clientName: 'Marie Dubois',
      clientCity: 'Issy-les-Moulineaux',
      rating: 5,
      comment:
        "Excellent travail pour la rénovation de notre salle de bain. L'équipe d'Atouts Services est très professionnelle et respecte les délais. Je recommande vivement !",
      projectType: 'salles-de-bains',
      published: true,
      featured: true,
    },
    {
      clientName: 'Pierre Martin',
      clientCity: 'Boulogne-Billancourt',
      rating: 5,
      comment:
        "Peinture complète de notre appartement réalisée dans les règles de l'art. Travail soigné, prix correct et excellent conseil pour les couleurs.",
      projectType: 'peinture',
      published: true,
      featured: true,
    },
    {
      clientName: 'Sophie Leroy',
      clientCity: 'Meudon',
      rating: 5,
      comment:
        "Rénovation électrique conforme aux normes avec un excellent rapport qualité-prix. L'équipe est à l'écoute et très compétente.",
      projectType: 'electricite',
      published: true,
      featured: true,
    },
    {
      clientName: 'Laurent Moreau',
      clientCity: 'Issy-les-Moulineaux',
      rating: 5,
      comment:
        "Rénovation complète de notre appartement de 75m². Coordination parfaite entre les différents corps de métier. Résultat impeccable, nous sommes ravis.",
      projectType: 'renovation',
      published: true,
      featured: true,
    },
    {
      clientName: 'Isabelle Petit',
      clientCity: 'Clamart',
      rating: 5,
      comment:
        "Pose de parquet dans tout l'appartement. Travail méticuleux, finitions parfaites et respect du planning annoncé. Je recommande sans hésiter.",
      projectType: 'revetements-sol',
      published: true,
      featured: false,
    },
    {
      clientName: 'Thomas Bernard',
      clientCity: 'Vanves',
      rating: 4,
      comment:
        "Très bonne prestation pour la peinture de nos chambres et du séjour. Couleurs bien conseillées et application soignée. Petit retard au démarrage mais résultat top.",
      projectType: 'peinture',
      published: true,
      featured: false,
    },
    {
      clientName: 'Nathalie Roux',
      clientCity: 'Boulogne-Billancourt',
      rating: 5,
      comment:
        "Installation domotique complète avec éclairage LED et volets connectés. Équipe très compétente et résultat à la hauteur de nos attentes.",
      projectType: 'electricite',
      published: true,
      featured: false,
    },
    {
      clientName: 'Jean-Pierre Garnier',
      clientCity: 'Meudon',
      rating: 5,
      comment:
        "Création d'une salle d'eau dans les combles. Projet complexe mené de main de maître. Plomberie, carrelage et finitions au top. Merci Atouts Services !",
      projectType: 'salles-de-bains',
      published: true,
      featured: false,
    },
  ];

  console.log('Seeding testimonials...');
  for (const t of testimonials) {
    try {
      await testimonialsService.create(t);
      console.log(`  + ${t.clientName} (${t.projectType})`);
    } catch (e) {
      console.log(`  ~ Skipped ${t.clientName}: ${e.message}`);
    }
  }

  // --- City Pages ---
  const cityPagesData = [
    {
      slug: 'issy-les-moulineaux',
      cityName: 'Issy-les-Moulineaux',
      department: 'Hauts-de-Seine (92)',
      postalCode: '92130',
      published: true,
      metaTitle:
        'Travaux de Rénovation à Issy-les-Moulineaux | Atouts Services',
      metaDescription:
        'Atouts Services, votre artisan de confiance à Issy-les-Moulineaux. Peinture, rénovation, électricité, salles de bains et revêtements de sol. Devis gratuit.',
      content: `## Votre artisan de confiance à Issy-les-Moulineaux

Atouts Services intervient à **Issy-les-Moulineaux** et ses environs pour tous vos travaux de rénovation, peinture, électricité et aménagement intérieur.

### Pourquoi nous choisir à Issy-les-Moulineaux ?

- **Proximité** : Basés dans les Hauts-de-Seine, nous intervenons rapidement
- **Expertise locale** : Nous connaissons les spécificités des logements isséens (immeubles haussmanniens, résidences modernes, maisons de ville)
- **Références** : De nombreux clients satisfaits dans votre quartier

### Nos interventions fréquentes à Issy

Les habitants d'Issy-les-Moulineaux nous sollicitent régulièrement pour :

- La **rénovation d'appartements** dans les immeubles du centre-ville
- La **peinture intérieure** et le rafraîchissement de logements
- La **mise aux normes électriques** des installations anciennes
- La **création ou rénovation de salles de bains** fonctionnelles
- La **pose de parquet** et revêtements de sol modernes

### Zone d'intervention

Nous couvrons l'ensemble d'Issy-les-Moulineaux : centre-ville, quartier des Épinettes, Val de Seine, Les Arches, Fort d'Issy et alentours.`,
    },
    {
      slug: 'boulogne-billancourt',
      cityName: 'Boulogne-Billancourt',
      department: 'Hauts-de-Seine (92)',
      postalCode: '92100',
      published: true,
      metaTitle:
        'Travaux de Rénovation à Boulogne-Billancourt | Atouts Services',
      metaDescription:
        'Artisan rénovation à Boulogne-Billancourt. Peinture, électricité, salles de bains, revêtements de sol. Devis gratuit et sans engagement.',
      content: `## Travaux de rénovation à Boulogne-Billancourt

Atouts Services réalise vos travaux de **rénovation à Boulogne-Billancourt**, la plus grande ville des Hauts-de-Seine.

### Notre expertise à Boulogne-Billancourt

Boulogne-Billancourt possède un parc immobilier varié : des immeubles art déco du centre aux résidences contemporaines du Trapèze. Notre équipe s'adapte à chaque type de bien pour des résultats sur mesure.

### Services proposés

- **Peinture** : Intérieure et extérieure, ravalement de façade
- **Rénovation** : Appartements et maisons, projets clé en main
- **Électricité** : Mise aux normes, domotique, éclairage LED
- **Salles de bains** : Création et rénovation complète
- **Revêtements de sol** : Parquet, carrelage, PVC

### Quartiers desservis

Nous intervenons dans tous les quartiers de Boulogne-Billancourt : centre-ville, Silly-Gallieni, Les Princes-Marmottan, République-Point du Jour, et le nouveau quartier du Trapèze.`,
    },
    {
      slug: 'meudon',
      cityName: 'Meudon',
      department: 'Hauts-de-Seine (92)',
      postalCode: '92190',
      published: true,
      metaTitle: 'Travaux de Rénovation à Meudon | Atouts Services',
      metaDescription:
        'Entreprise de rénovation à Meudon. Peinture, électricité, salles de bains, sols. Artisans qualifiés, devis gratuit.',
      content: `## Rénovation et travaux à Meudon

Atouts Services accompagne les Meudonnais dans leurs projets de **rénovation et d'aménagement intérieur**.

### Meudon : des logements qui méritent le meilleur

Entre les pavillons de Meudon-la-Forêt et les appartements de Meudon-Val-Fleury, la ville offre une grande diversité de logements. Nous adaptons nos prestations à chaque configuration.

### Nos prestations à Meudon

- **Rénovation de pavillons** : Modernisation complète ou partielle
- **Peinture d'appartements** : Intérieur, cages d'escalier
- **Électricité** : Mise en conformité, tableaux électriques
- **Salles de bains** : Rénovation et optimisation de l'espace
- **Sols** : Pose de parquet, carrelage, revêtements

### Zone d'intervention

Nous couvrons Meudon centre, Meudon-la-Forêt, Meudon-Val-Fleury, Bellevue et les communes limitrophes (Clamart, Sèvres, Chaville).`,
    },
  ];

  console.log('\nSeeding city pages...');
  for (const cp of cityPagesData) {
    try {
      await cityPagesService.create(cp);
      console.log(`  + ${cp.cityName}`);
    } catch (e) {
      console.log(`  ~ Skipped ${cp.cityName}: ${e.message}`);
    }
  }

  // --- Blog Posts ---
  const blogPosts = [
    {
      title: 'Guide des prix de rénovation en 2025 : combien coûtent vos travaux ?',
      slug: 'guide-prix-renovation-2025',
      excerpt:
        'Découvrez les prix moyens pour tous les travaux de rénovation en 2025 : peinture, électricité, salle de bains, sols et rénovation complète. Budget détaillé au m².',
      category: 'conseils',
      tags: ['prix', 'rénovation', 'budget', 'devis', 'guide'],
      published: true,
      publishedAt: new Date().toISOString(),
      metaTitle:
        'Guide des Prix de Rénovation 2025 | Coûts au m² et Budgets',
      metaDescription:
        'Prix de rénovation 2025 au m² : peinture (25-45€), salle de bains (800-1500€/m²), électricité (80-120€/point). Guide complet pour estimer votre budget travaux.',
      content: `## Comprendre les prix de rénovation en 2025

Vous envisagez des travaux de rénovation dans votre logement en Île-de-France ? Avant de vous lancer, il est essentiel de bien comprendre les coûts impliqués. Chez Atouts Services, nous accompagnons chaque année des dizaines de propriétaires dans leurs projets de rénovation à Issy-les-Moulineaux, Boulogne-Billancourt, Meudon et dans tout le département des Hauts-de-Seine. Ce guide vous donne une vision claire et réaliste des prix pratiqués en 2025.

Les tarifs présentés dans cet article sont des moyennes constatées en Île-de-France. Les prix réels dépendent de nombreux facteurs que nous détaillons plus bas : surface, état du logement, qualité des matériaux choisis et complexité du chantier.

## Prix de la peinture intérieure

### Peinture murale

La peinture reste le poste de rénovation le plus courant et le plus accessible. Les prix varient selon la préparation nécessaire et la qualité de la peinture choisie.

- **Peinture simple (murs en bon état)** : 25 à 35 € / m² — Comprend le lessivage, une sous-couche et deux couches de peinture acrylique.
- **Peinture avec préparation standard** : 35 à 45 € / m² — Inclut le rebouchage des petits trous, le ponçage léger, la sous-couche et deux couches de finition.
- **Peinture avec grosse préparation** : 45 à 65 € / m² — Pour les murs abîmés nécessitant un enduit de lissage complet, un ponçage approfondi et parfois le traitement de problèmes d'humidité.
- **Peinture plafond** : 30 à 50 € / m² — Plus technique que les murs, la peinture au plafond demande un savoir-faire particulier pour éviter les traces et coulures.

### Peinture extérieure et ravalement

Pour les propriétaires de maisons individuelles à Meudon ou dans les communes voisines, le ravalement de façade est un investissement important mais obligatoire tous les 10 ans en Île-de-France.

- **Ravalement simple (nettoyage + peinture)** : 40 à 80 € / m² de façade
- **Ravalement avec réparation d'enduit** : 80 à 120 € / m²
- **Ravalement avec isolation par l'extérieur (ITE)** : 120 à 200 € / m²

### Facteurs influençant le prix de la peinture

La hauteur sous plafond est un facteur important : au-delà de 2,70 m, la mise en place d'échafaudages intérieurs fait augmenter le coût. L'état des supports, le nombre de couleurs différentes et l'accès au chantier (étage sans ascenseur par exemple) influencent également le devis final.

## Prix de la rénovation de salle de bains

La salle de bains est le poste de rénovation le plus coûteux au mètre carré, mais aussi celui qui apporte la plus grande valeur ajoutée à votre bien immobilier.

### Rénovation partielle

- **Remplacement des équipements sanitaires** : 2 000 à 5 000 € — Nouveau lavabo, WC, robinetterie sans toucher au carrelage ni à la plomberie existante.
- **Réfection du carrelage mural et sol** : 60 à 120 € / m² — Dépose de l'ancien, préparation du support et pose de nouveau carrelage.
- **Remplacement de la baignoire par une douche** : 3 500 à 7 000 € — Inclut la dépose, la création du receveur, la paroi et la robinetterie.

### Rénovation complète

- **Salle de bains standard (4-6 m²)** : 800 à 1 200 € / m² — Comprend la dépose complète, la plomberie, l'électricité, le carrelage, les équipements sanitaires et les finitions.
- **Salle de bains haut de gamme** : 1 200 à 1 800 € / m² — Matériaux premium (faïence grand format, robinetterie design, meuble vasque sur mesure), douche italienne, sèche-serviettes design.
- **Création d'une salle d'eau (dans les combles par exemple)** : 1 500 à 2 500 € / m² — Nécessite la création des arrivées et évacuations d'eau, de l'électricité et souvent une VMC.

### Ce qui fait varier le prix

La complexité de la plomberie est le premier facteur. Déplacer un WC ou créer une évacuation là où il n'y en avait pas coûte significativement plus cher. Le choix des matériaux a également un impact majeur : un carrelage à 20 € / m² et un carrelage à 80 € / m² changent radicalement le budget final.

## Prix de l'électricité

### Mise aux normes

De nombreux logements anciens en Hauts-de-Seine nécessitent une mise en conformité de leur installation électrique. Les prix dépendent principalement du nombre de points lumineux et de prises à traiter.

- **Remplacement du tableau électrique** : 800 à 1 500 € — Nouveau tableau aux normes NF C 15-100, disjoncteur différentiel 30 mA et protections par circuit.
- **Prix par point électrique** : 80 à 150 € / point — Comprend le tirage de câble, la pose de la boîte d'encastrement et de l'appareillage (prise ou interrupteur).
- **Mise aux normes complète (appartement 60-80 m²)** : 5 000 à 10 000 € — Remplacement de tout le circuit depuis le tableau, nouvelles prises et interrupteurs, mise à la terre.

### Installations spécifiques

- **Domotique et éclairage connecté** : 150 à 300 € / point — Interrupteurs connectés, variateurs, scénarios d'éclairage programmables.
- **Installation de spots LED encastrés** : 80 à 120 € / spot — Perçage, câblage, alimentation et spot LED inclus.
- **Borne de recharge véhicule électrique** : 1 200 à 2 500 € — Installation complète avec protection dédiée au tableau.

## Prix des revêtements de sol

### Parquet

Le parquet reste le revêtement préféré des Français pour les pièces de vie. Les prix varient fortement selon le type de parquet choisi.

- **Parquet stratifié** : 30 à 50 € / m² posé — Solution économique, facile d'entretien, large choix de décors. Convient bien pour les chambres et les pièces à faible passage.
- **Parquet contrecollé** : 50 à 90 € / m² posé — Couche supérieure en bois véritable, pose flottante ou collée. Bon compromis qualité/prix pour le séjour.
- **Parquet massif** : 80 à 150 € / m² posé — Le plus noble et le plus durable. Chêne, hêtre ou essences exotiques. Peut être poncé et rénové plusieurs fois.

### Carrelage

- **Carrelage grès cérame** : 40 à 80 € / m² posé — Résistant et facile d'entretien, idéal pour les pièces humides et les zones de passage.
- **Carrelage imitation parquet** : 50 à 90 € / m² posé — L'esthétique du bois avec la résistance du carrelage. Très tendance en 2025.
- **Carrelage grand format (60x60 et plus)** : 60 à 120 € / m² posé — Effet moderne et épuré, moins de joints, mais pose plus technique.

### Autres revêtements

- **PVC / LVT (Luxury Vinyl Tile)** : 25 à 55 € / m² posé — Très bon rapport qualité/prix, résistant à l'eau, confortable sous le pied.
- **Béton ciré** : 100 à 180 € / m² — Rendu contemporain et sans joints, mais nécessite une pose par un spécialiste.

## Prix de la rénovation complète d'un appartement

Pour une rénovation globale, les prix s'échelonnent selon l'ampleur des travaux.

- **Rafraîchissement léger** : 300 à 500 € / m² — Peinture des murs et plafonds, remplacement des revêtements de sol, petits travaux de finition. Pas de modification des réseaux ni de l'agencement.
- **Rénovation intermédiaire** : 600 à 900 € / m² — Rafraîchissement complet plus rénovation de la salle de bains et/ou de la cuisine, mise aux normes électriques partielle, remplacement des menuiseries intérieures.
- **Rénovation lourde** : 900 à 1 500 € / m² — Redistribution des espaces (déplacement de cloisons), reprise complète de l'électricité et de la plomberie, création de salle de bains, nouvelle cuisine, sols et peinture.

### Exemples de budgets pour les Hauts-de-Seine

Pour un appartement de 60 m² à Issy-les-Moulineaux :
- Rafraîchissement : 18 000 à 30 000 €
- Rénovation intermédiaire : 36 000 à 54 000 €
- Rénovation lourde : 54 000 à 90 000 €

Pour une maison de 100 m² à Meudon :
- Rafraîchissement : 30 000 à 50 000 €
- Rénovation intermédiaire : 60 000 à 90 000 €
- Rénovation lourde : 90 000 à 150 000 €

## Ce qui influence le prix final

Plusieurs facteurs font varier le prix de vos travaux :

1. **L'état initial du logement** — Un appartement récent nécessitant un simple rafraîchissement coûtera bien moins qu'un logement ancien avec des problèmes structurels, d'humidité ou une installation électrique vétuste.

2. **La qualité des matériaux** — Le choix entre un carrelage d'entrée de gamme et un carrelage haut de gamme peut doubler le budget matériaux. Nous vous conseillons sur le meilleur rapport qualité/prix selon vos priorités.

3. **L'accessibilité du chantier** — Un appartement au 5e étage sans ascenseur implique des surcoûts logistiques pour le transport des matériaux et l'évacuation des gravats.

4. **La période de l'année** — Les artisans sont plus disponibles en hiver, ce qui peut permettre de négocier des tarifs plus avantageux. Le printemps et l'automne sont les périodes les plus demandées.

5. **L'ampleur du chantier** — Un projet global permet de mutualiser certains coûts (installation de chantier, protections, logistique) et revient proportionnellement moins cher qu'une succession de petits chantiers.

## Comment obtenir un devis fiable ?

Pour obtenir un devis précis et sans mauvaise surprise, suivez ces recommandations :

- **Définissez clairement votre projet** avant de contacter un artisan. Plus votre cahier des charges est précis, plus le devis sera juste.
- **Comparez 2 à 3 devis**, mais attention : le moins cher n'est pas toujours le meilleur choix. Vérifiez ce qui est inclus et exclu.
- **Méfiez-vous des prix trop bas** : ils cachent souvent des matériaux de mauvaise qualité, du travail non déclaré ou des postes manquants qui feront grimper la facture en cours de chantier.
- **Demandez un devis détaillé** : chaque poste doit être chiffré séparément (fournitures, main d'œuvre, TVA).

## Obtenez votre estimation gratuite

Chez Atouts Services, nous proposons un devis gratuit et détaillé pour tous vos projets de rénovation dans les Hauts-de-Seine. Notre simulateur en ligne vous permet d'obtenir une première estimation, et notre équipe se déplace pour affiner le chiffrage sur place.

Contactez-nous pour discuter de votre projet et obtenir un devis personnalisé adapté à votre budget.`,
    },
    {
      title: 'Les aides financières pour la rénovation en 2025 : guide complet',
      slug: 'aides-financieres-renovation-2025',
      excerpt:
        "Toutes les aides pour financer vos travaux en 2025 : MaPrimeRénov', CEE, éco-PTZ, TVA réduite, aides locales en Hauts-de-Seine. Conditions, montants et démarches.",
      category: 'aides',
      tags: ['aides financières', 'rénovation', 'MaPrimeRénov', 'éco-PTZ', 'CEE', 'subventions'],
      published: true,
      publishedAt: new Date().toISOString(),
      metaTitle:
        "Aides Rénovation 2025 : MaPrimeRénov', CEE, Éco-PTZ | Guide Complet",
      metaDescription:
        "Guide complet des aides financières pour la rénovation en 2025. MaPrimeRénov', CEE, éco-PTZ, TVA réduite, aides locales. Conditions, montants et démarches détaillées.",
      content: `## Pourquoi connaître les aides à la rénovation ?

La rénovation de votre logement représente un investissement important. Heureusement, de nombreuses aides financières existent pour alléger la facture. En 2025, le dispositif d'aides à la rénovation est plus étoffé que jamais, mais aussi plus complexe à appréhender. Ce guide vous présente toutes les aides disponibles, leurs conditions d'éligibilité et les démarches pour en bénéficier.

Chez Atouts Services, nous accompagnons nos clients dans l'identification des aides auxquelles ils ont droit. Certains de nos clients en Hauts-de-Seine ont pu financer jusqu'à 60% de leurs travaux grâce au cumul de plusieurs dispositifs.

## MaPrimeRénov' : l'aide principale de l'État

### Présentation

MaPrimeRénov' est le dispositif phare de l'État pour encourager la rénovation énergétique des logements. Lancée en 2020 en remplacement du Crédit d'Impôt pour la Transition Énergétique (CITE), cette aide a été considérablement élargie et simplifiée au fil des ans.

En 2025, MaPrimeRénov' s'articule autour de deux parcours distincts : le parcours « par geste » pour des travaux ciblés, et le parcours « accompagné » pour des rénovations d'ampleur.

### Qui peut en bénéficier ?

- **Les propriétaires occupants** : Quel que soit votre niveau de revenus, vous pouvez prétendre à MaPrimeRénov'. Le montant de l'aide varie toutefois en fonction de vos ressources.
- **Les propriétaires bailleurs** : Depuis 2021, les bailleurs peuvent également bénéficier de MaPrimeRénov' pour rénover les logements qu'ils mettent en location, dans la limite de 3 logements.
- **Les copropriétés** : MaPrimeRénov' Copropriétés finance les travaux votés en assemblée générale sur les parties communes.

### Travaux éligibles au parcours « par geste »

Ce parcours finance un travail spécifique :

- **Isolation thermique** : Murs par l'intérieur (25 à 75 € / m²) ou par l'extérieur (75 à 100 € / m²), toiture, planchers bas, fenêtres et portes.
- **Chauffage** : Pompe à chaleur air/eau (jusqu'à 5 000 €), chaudière biomasse (jusqu'à 5 000 €), poêle à bois (jusqu'à 2 500 €), chauffe-eau thermodynamique (jusqu'à 1 200 €).
- **Ventilation** : VMC double flux (jusqu'à 2 500 €) pour améliorer la qualité de l'air intérieur tout en limitant les déperditions thermiques.

### Travaux éligibles au parcours « accompagné »

Pour les rénovations ambitieuses visant un gain d'au moins 2 classes énergétiques sur le DPE :

- **Ménages très modestes** : Prise en charge jusqu'à 90% du montant HT des travaux, dans la limite de 70 000 €.
- **Ménages modestes** : Jusqu'à 75% du montant, dans la limite de 55 000 €.
- **Ménages intermédiaires** : Jusqu'à 60% du montant, dans la limite de 40 000 €.
- **Ménages aisés** : Jusqu'à 40% du montant, dans la limite de 30 000 €.

### Comment déposer une demande

1. Créez votre compte sur le site officiel France Rénov'
2. Renseignez les informations sur votre logement et votre situation fiscale
3. Obtenez le devis d'un artisan RGE (Reconnu Garant de l'Environnement)
4. Déposez votre demande en ligne avec le devis
5. Attendez l'accord avant de démarrer les travaux
6. Après réalisation, transmettez la facture pour déclencher le versement

**Important** : Les travaux ne doivent pas commencer avant l'obtention de l'accord de MaPrimeRénov'. Toute demande rétroactive sera refusée.

## Les Certificats d'Économies d'Énergie (CEE)

### Comment ça fonctionne ?

Les CEE sont un dispositif qui oblige les fournisseurs d'énergie (EDF, Engie, TotalEnergies, etc.) à financer des travaux d'économies d'énergie chez les particuliers. Concrètement, ces entreprises vous versent une prime pour chaque opération de rénovation énergétique réalisée.

### Montants des primes CEE

Les montants dépendent du type de travaux, de la zone géographique et de vos revenus :

- **Isolation des combles** : 10 à 25 € / m²
- **Isolation des murs** : 15 à 35 € / m²
- **Remplacement de fenêtres** : 50 à 150 € / fenêtre
- **Installation d'une pompe à chaleur** : 2 500 à 5 000 €
- **Thermostat programmable** : 100 à 200 €

### Cumul avec MaPrimeRénov'

Bonne nouvelle : les CEE sont **cumulables avec MaPrimeRénov'**. Vous pouvez donc bénéficier des deux aides simultanément, ce qui réduit considérablement votre reste à charge.

### Comment obtenir les CEE

Plusieurs options s'offrent à vous :
- Passer par votre fournisseur d'énergie directement
- Utiliser un comparateur de primes CEE en ligne
- Demander à votre artisan de vous orienter (certains intègrent la prime CEE dans leur devis)

**Attention** : Vous devez vous inscrire au programme CEE **avant** la signature du devis. Toute demande postérieure à l'engagement des travaux sera refusée.

## L'éco-prêt à taux zéro (éco-PTZ)

### Principe

L'éco-PTZ vous permet d'emprunter sans intérêts pour financer des travaux de rénovation énergétique. C'est un complément idéal aux aides directes car il couvre le reste à charge.

### Caractéristiques en 2025

- **Montant maximum** : 50 000 € pour une rénovation globale performante, 30 000 € pour un bouquet de travaux (3 actions minimum), 15 000 € pour une action seule.
- **Durée de remboursement** : Jusqu'à 20 ans, sans frais de dossier ni intérêts.
- **Condition** : Le logement doit avoir été construit depuis plus de 2 ans.
- **Aucune condition de revenus** : Tous les propriétaires peuvent en bénéficier.

### Banques partenaires

Toutes les banques ne proposent pas l'éco-PTZ. En Île-de-France, vous pouvez vous adresser aux principaux réseaux : Crédit Agricole, BNP Paribas, Société Générale, Banque Populaire, Caisse d'Épargne et Crédit Mutuel.

## La TVA à taux réduit

### TVA à 5,5%

Le taux réduit de TVA à 5,5% s'applique aux travaux d'amélioration de la performance énergétique : isolation, installation de chauffage performant, équipements de production d'énergie renouvelable.

### TVA à 10%

Le taux intermédiaire de 10% s'applique aux travaux de rénovation, d'amélioration et d'entretien dans les logements achevés depuis plus de 2 ans : peinture, revêtements de sol, réfection de salle de bains, travaux de plomberie et d'électricité.

### Conditions

- Le logement doit être achevé depuis plus de 2 ans
- Les travaux doivent être réalisés par une entreprise
- La TVA réduite s'applique automatiquement sur le devis et la facture de l'artisan

**À noter** : La TVA à 10% au lieu de 20% représente déjà une économie significative. Sur un chantier de 30 000 € HT, vous économisez 3 000 € de TVA.

## Les aides locales en Hauts-de-Seine

### Aides du département

Le Conseil départemental des Hauts-de-Seine propose des aides complémentaires pour l'amélioration de l'habitat, en partenariat avec l'ANAH (Agence Nationale de l'Habitat). Ces aides ciblent principalement les propriétaires modestes et très modestes.

### Aides communales

Certaines communes des Hauts-de-Seine proposent leurs propres dispositifs d'aide :

- **Issy-les-Moulineaux** : Subventions pour les travaux d'économie d'énergie dans le cadre du Plan Climat local. La ville propose également un guichet unique d'information sur les aides à la rénovation énergétique.
- **Boulogne-Billancourt** : Programme d'aide à la réhabilitation du parc privé, en partenariat avec l'ANAH, pour les copropriétés en difficulté et les propriétaires modestes.
- **Meudon** : Aide à la rénovation thermique des pavillons, dans le cadre du programme « Meudon Durable ». La ville subventionne les audits énergétiques et certains travaux d'isolation.

### Comment connaître les aides locales

Rendez-vous à l'Espace Info Énergie le plus proche ou à votre mairie pour connaître les dispositifs locaux. Le réseau France Rénov' propose également un simulateur en ligne qui intègre les aides locales.

## Exemples concrets de financement

### Exemple 1 : Isolation des murs par l'intérieur (appartement 60 m²)

- Coût total des travaux : 8 000 €
- MaPrimeRénov' (revenus intermédiaires) : - 2 400 €
- Prime CEE : - 900 €
- **Reste à charge : 4 700 € (41% d'économie)**

### Exemple 2 : Rénovation globale performante (maison 100 m², gain de 3 classes DPE)

- Coût total des travaux : 45 000 €
- MaPrimeRénov' Parcours accompagné (revenus modestes, 75%) : - 33 750 €
- Prime CEE : - 3 000 €
- **Reste à charge : 8 250 € (82% d'économie)**
- Financement du reste : éco-PTZ de 8 250 € sur 15 ans = 46 € / mois sans intérêts

### Exemple 3 : Remplacement de fenêtres (6 fenêtres double vitrage)

- Coût total : 6 000 €
- MaPrimeRénov' (revenus modestes) : - 2 400 €
- Prime CEE : - 600 €
- TVA à 5,5% au lieu de 20% : - 870 € d'économie
- **Reste à charge : 2 130 € (64% d'économie)**

## Les erreurs à éviter

1. **Commencer les travaux avant d'avoir les accords** : C'est la première cause de refus des aides. Déposez toutes vos demandes et attendez les confirmations.
2. **Ne pas vérifier la certification RGE de l'artisan** : MaPrimeRénov' et les CEE exigent un artisan certifié RGE pour le type de travaux concerné.
3. **Oublier de cumuler les aides** : MaPrimeRénov' + CEE + éco-PTZ + TVA réduite sont cumulables. Ne passez à côté d'aucun dispositif.
4. **Sous-estimer les délais** : Les demandes de MaPrimeRénov' peuvent prendre 4 à 8 semaines. Anticipez vos démarches.
5. **Ne pas consulter les aides locales** : Les aides communales et départementales sont souvent méconnues mais peuvent représenter un complément appréciable.

## Atouts Services vous accompagne dans vos démarches

Nos équipes connaissent parfaitement les dispositifs d'aide disponibles en Hauts-de-Seine. Nous vous aidons à :

- Identifier toutes les aides auxquelles vous avez droit
- Constituer vos dossiers de demande
- Coordonner le calendrier entre les accords d'aide et le démarrage des travaux
- Réaliser les travaux dans les règles de l'art avec nos artisans qualifiés

Contactez-nous pour un diagnostic gratuit de votre projet et une estimation des aides disponibles.`,
    },
    {
      title: 'Comment bien choisir son artisan pour des travaux de rénovation',
      slug: 'comment-choisir-artisan-renovation',
      excerpt:
        'Les critères essentiels pour sélectionner un artisan de confiance : certifications, assurances, devis, références. Guide pratique pour éviter les mauvaises surprises.',
      category: 'conseils',
      tags: ['artisan', 'rénovation', 'conseils', 'devis', 'assurance', 'RGE'],
      published: true,
      publishedAt: new Date().toISOString(),
      metaTitle:
        'Comment Choisir un Artisan pour vos Travaux | Guide Pratique 2025',
      metaDescription:
        'Guide pour bien choisir votre artisan : vérifier les certifications RGE, les assurances, comparer les devis, contrôler les références. Conseils de professionnels.',
      content: `## Pourquoi le choix de l'artisan est déterminant

Le choix de l'artisan est sans doute la décision la plus importante de votre projet de rénovation. Un bon artisan vous garantit un travail de qualité, le respect des délais et du budget, et surtout une tranquillité d'esprit pendant toute la durée du chantier. À l'inverse, un mauvais choix peut transformer votre projet de rêve en cauchemar : malfaçons, retards, factures qui explosent, voire abandon de chantier.

En Île-de-France et particulièrement dans les Hauts-de-Seine, le marché de la rénovation est très concurrentiel. Vous trouverez aussi bien d'excellents professionnels que des entreprises peu scrupuleuses. Ce guide vous donne toutes les clés pour faire le bon choix.

## Les vérifications indispensables avant de signer

### 1. L'immatriculation et l'existence légale

Avant même de demander un devis, vérifiez que l'entreprise existe légalement et est en règle :

- **Numéro SIRET** : Toute entreprise doit disposer d'un numéro SIRET valide. Vous pouvez le vérifier gratuitement sur le site de l'INSEE (sirene.fr) ou sur societe.com.
- **Inscription au Registre des Métiers** : Les artisans du bâtiment doivent être inscrits à la Chambre des Métiers et de l'Artisanat. Cette inscription garantit que le dirigeant possède les qualifications nécessaires.
- **Ancienneté** : Sans être un critère absolu, une entreprise qui existe depuis plusieurs années a démontré sa capacité à satisfaire ses clients et à gérer ses chantiers correctement.

### 2. Les assurances obligatoires

C'est LE point à ne jamais négliger. Un artisan doit obligatoirement disposer de deux assurances :

**L'assurance décennale**

L'assurance décennale (ou garantie décennale) couvre les dommages qui compromettent la solidité de l'ouvrage ou le rendent impropre à sa destination pendant 10 ans après la réception des travaux. Elle est obligatoire pour tous les travaux de construction et de rénovation.

Concrètement, elle couvre par exemple : une fissure structurelle apparaissant après des travaux de gros œuvre, une infiltration d'eau due à une mauvaise étanchéité de la salle de bains, un défaut d'isolation thermique rendant le logement inhabitable.

**L'assurance responsabilité civile professionnelle**

Elle couvre les dommages causés aux tiers pendant le chantier : dégâts chez un voisin, blessure d'un passant, dommage accidentel à votre mobilier.

**Comment vérifier ?**

Demandez systématiquement une copie de l'attestation d'assurance en cours de validité. Vérifiez que les activités déclarées correspondent aux travaux que vous souhaitez réaliser. Un peintre assuré uniquement pour la peinture ne sera pas couvert s'il réalise des travaux de plomberie.

### 3. Les certifications et labels

Les certifications sont un gage de compétence et de sérieux. Les principales certifications à connaître pour les travaux de rénovation sont les suivantes.

**Certification RGE (Reconnu Garant de l'Environnement)**

Indispensable si vous souhaitez bénéficier des aides à la rénovation énergétique (MaPrimeRénov', CEE, éco-PTZ). La certification RGE atteste que l'artisan a suivi une formation spécifique et respecte des critères de qualité.

Il existe plusieurs qualifications RGE selon les domaines : Qualibat RGE pour le bâtiment, QualiPAC pour les pompes à chaleur, QualiSol pour le solaire thermique, etc.

Vous pouvez vérifier la certification RGE d'un artisan sur le site officiel France Rénov'.

**Label Qualibat**

Au-delà du RGE, Qualibat propose des certifications par métier qui attestent des compétences techniques de l'entreprise. Une entreprise Qualibat a été auditée et a démontré sa capacité à réaliser des travaux de qualité dans sa spécialité.

**Certification NF Habitat**

Pour les entreprises de rénovation globale, la certification NF Habitat garantit un haut niveau de qualité sur l'ensemble du projet, de la conception à la livraison.

### 4. Les références et réalisations

Un bon artisan est fier de montrer ses réalisations. Demandez-lui systématiquement des photos de chantiers récents similaires au vôtre, les coordonnées de clients récents que vous pouvez contacter et, si possible, la possibilité de visiter un chantier en cours ou terminé.

Consultez également les avis en ligne sur Google, Pages Jaunes ou des sites spécialisés comme Houzz. Méfiez-vous toutefois des avis trop uniformément positifs qui peuvent être factices. Cherchez des avis détaillés qui décrivent le déroulement réel du chantier.

## Analyser et comparer les devis

### Ce que doit contenir un devis conforme

Un devis est un document contractuel qui engage l'artisan. Il doit obligatoirement mentionner les éléments suivants :

- **Informations sur l'entreprise** : Nom, adresse, SIRET, assurance décennale (numéro de police et coordonnées de l'assureur).
- **Description détaillée des travaux** : Chaque poste doit être clairement décrit avec les quantités, les unités de mesure et les prix unitaires.
- **Matériaux utilisés** : Marque, référence, qualité. Un devis qui indique simplement « carrelage » sans préciser le type, le format et la qualité est insuffisant.
- **Main d'œuvre** : Détaillée par poste, avec le nombre d'heures ou de jours prévus.
- **Montant total HT et TTC** : Avec le taux de TVA applicable (5,5%, 10% ou 20% selon les travaux).
- **Durée de validité du devis** : Généralement 1 à 3 mois.
- **Calendrier prévisionnel** : Date de début et durée estimée des travaux.
- **Conditions de paiement** : Échéancier des paiements, modalités d'acompte.

### Les pièges à éviter dans les devis

**Le devis trop vague** : « Rénovation salle de bains : 8 000 € TTC ». Ce type de devis est une source de conflits garantie. Vous ne savez pas ce qui est inclus, quels matériaux seront utilisés, ni ce qui se passera si des imprévus surviennent.

**Le devis anormalement bas** : Si un devis est 30 à 40% moins cher que les autres, posez-vous des questions. L'artisan utilise peut-être des matériaux de qualité inférieure, sous-traite à du personnel non qualifié, travaille sans assurance, ou prévoit de facturer des « suppléments » en cours de chantier.

**L'absence de mention des imprévus** : Un bon devis prévoit une clause sur la gestion des imprévus (découverte de problèmes cachés : humidité, amiante, structure défaillante). Comment seront-ils traités ? Qui décide ? Comment le surcoût est-il estimé ?

**Le paiement intégral à l'avance** : Ne payez jamais la totalité du chantier avant le début des travaux. Un échéancier raisonnable prévoit 20 à 30% d'acompte à la commande, un ou deux paiements intermédiaires à l'avancement, et le solde de 5 à 10% à la réception.

### Combien de devis demander ?

La règle d'or est de comparer au moins 3 devis pour le même projet. Cela vous permet de vérifier la cohérence des prix, d'identifier les postes sous-estimés ou oubliés, et de vous faire une idée du « juste prix » de votre projet.

Veillez à comparer des prestations identiques : même surface, mêmes matériaux (ou de qualité équivalente), mêmes travaux préparatoires.

## Les questions à poser lors du premier rendez-vous

Lors de la visite de votre logement par l'artisan, posez-lui les questions suivantes :

1. **Depuis combien de temps exercez-vous ?** — L'expérience est un indicateur important, surtout pour les travaux complexes.

2. **Réalisez-vous les travaux vous-même ou sous-traitez-vous ?** — Si l'artisan sous-traite, demandez à connaître les sous-traitants et leurs qualifications.

3. **Combien de chantiers menez-vous en parallèle ?** — Un artisan qui gère trop de chantiers simultanément risque de délaisser le vôtre.

4. **Quel est votre délai d'intervention ?** — Un artisan très demandé peut avoir plusieurs mois d'attente. C'est souvent bon signe, mais il faut planifier en conséquence.

5. **Comment gérez-vous les imprévus ?** — Les imprévus sont fréquents en rénovation. Un artisan sérieux vous prévient immédiatement, vous explique le problème et vous propose des solutions chiffrées.

6. **Pouvez-vous me fournir des photos de chantiers similaires ?** — Un professionnel compétent documente ses réalisations.

7. **Quel suivi de chantier proposez-vous ?** — Réunions régulières, compte-rendus par email, accès à un espace client en ligne… Les méthodes modernes de suivi de chantier facilitent la communication.

## Les signaux d'alerte à ne pas ignorer

Certains comportements doivent vous alerter et vous inciter à chercher un autre artisan :

- **Pas de visite sur place** : Un artisan qui fait un devis sans voir votre logement ne peut pas chiffrer correctement les travaux.
- **Pas d'adresse fixe** : Méfiez-vous des entreprises sans local identifiable, qui ne communiquent qu'un numéro de portable.
- **Pression pour signer vite** : « Ce prix est valable seulement aujourd'hui » ou « J'ai un trou dans mon planning la semaine prochaine » sont des tactiques de vente, pas des pratiques professionnelles.
- **Refus de fournir des références** : Un bon artisan n'a rien à cacher et est fier de ses réalisations passées.
- **Demande de paiement en espèces** : Un professionnel en règle accepte les chèques et les virements. Le paiement en espèces au-delà de 1 000 € est d'ailleurs interdit.
- **Pas de devis écrit** : Aucun travail ne doit être engagé sans devis signé. C'est votre protection en cas de litige.

## Les recours en cas de problème

Malgré toutes vos précautions, des problèmes peuvent survenir. Voici les recours disponibles :

- **La garantie de parfait achèvement** (1 an) : L'artisan doit réparer tous les défauts signalés dans l'année suivant la réception.
- **La garantie biennale** (2 ans) : Couvre les éléments d'équipement dissociables (robinetterie, volets, radiateurs).
- **La garantie décennale** (10 ans) : Couvre les dommages structurels et les défauts rendant l'ouvrage impropre à sa destination.
- **La médiation de la consommation** : Gratuite et obligatoire, elle permet de résoudre les litiges à l'amiable.
- **Le tribunal judiciaire** : En dernier recours, pour les litiges supérieurs à 10 000 €.

## Pourquoi choisir Atouts Services ?

Chez Atouts Services, nous répondons à tous les critères de sélection d'un artisan de confiance :

- **Entreprise établie** dans les Hauts-de-Seine avec une adresse fixe et un numéro SIRET vérifiable.
- **Assurance décennale et RC Pro** à jour, attestations disponibles sur simple demande.
- **Devis gratuits et détaillés** : Chaque poste est chiffré précisément, avec les matériaux référencés.
- **Références clients** : Des dizaines de chantiers réalisés à Issy-les-Moulineaux, Boulogne-Billancourt, Meudon et dans toutes les communes des Hauts-de-Seine.
- **Suivi de chantier transparent** : Espace client en ligne, mises à jour régulières, photos d'avancement.
- **Garanties complètes** : Garantie de parfait achèvement, garantie biennale et garantie décennale sur tous nos chantiers.

Contactez-nous pour un premier rendez-vous gratuit et sans engagement. Nous nous déplaçons dans toutes les Hauts-de-Seine pour étudier votre projet.`,
    },
  ];

  console.log('\nSeeding blog posts...');
  for (const bp of blogPosts) {
    try {
      await blogService.create(bp);
      console.log(`  + ${bp.title}`);
    } catch (e) {
      console.log(`  ~ Skipped "${bp.title}": ${e.message}`);
    }
  }

  console.log('\n=== Seeding Complete ===\n');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
