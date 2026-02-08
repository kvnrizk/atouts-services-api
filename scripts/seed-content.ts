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
      title: 'Comment bien préparer vos murs avant peinture',
      slug: 'preparer-murs-avant-peinture',
      excerpt:
        'La préparation des murs est une étape cruciale pour un résultat de peinture impeccable. Découvrez nos conseils de professionnels.',
      category: 'conseils',
      tags: ['peinture', 'préparation', 'murs', 'conseils'],
      published: true,
      publishedAt: new Date().toISOString(),
      metaTitle:
        'Comment Préparer ses Murs Avant Peinture | Guide Complet',
      metaDescription:
        "Guide complet pour préparer vos murs avant peinture : rebouchage, ponçage, sous-couche. Conseils d'artisans professionnels.",
      content: `## Pourquoi la préparation est essentielle

Une peinture réussie commence toujours par une préparation minutieuse des supports. Chez Atouts Services, nous consacrons souvent autant de temps à la préparation qu'à l'application de la peinture elle-même.

## Les étapes de préparation

### 1. Diagnostic de l'état des murs

Avant tout, examinez vos murs attentivement :
- **Fissures** : À reboucher impérativement
- **Taches d'humidité** : À traiter avant toute peinture
- **Anciennes peintures écaillées** : À gratter et poncer
- **Trous de chevilles** : À reboucher à l'enduit

### 2. Nettoyage

Dépoussiérez vos murs à l'aide d'une éponge humide ou d'un aspirateur. Pour les murs de cuisine, dégraissez avec un produit adapté. Les murs de salle de bain peuvent nécessiter un traitement anti-moisissure.

### 3. Rebouchage et enduit

- Utilisez un **enduit de rebouchage** pour les trous et fissures profondes
- Appliquez un **enduit de lissage** pour obtenir une surface parfaitement plane
- Laissez sécher selon les recommandations du fabricant

### 4. Ponçage

Poncez l'ensemble de la surface avec un papier de verre grain 120 à 150. Cette étape assure une meilleure adhérence de la peinture.

### 5. Sous-couche

L'application d'une sous-couche (ou primaire d'accrochage) est indispensable pour :
- Uniformiser l'absorption du support
- Améliorer l'adhérence de la peinture de finition
- Réduire le nombre de couches nécessaires

## Nos conseils de pro

- **Ne peignez jamais sur un mur humide** : attendez que le support soit parfaitement sec
- **Protégez les sols et meubles** avec des bâches avant de commencer
- **Travaillez dans un espace ventilé** pour un séchage optimal
- **Investissez dans de bons outils** : rouleau de qualité, scotch de masquage professionnel

## Besoin d'aide ?

Si la préparation vous semble trop complexe, n'hésitez pas à faire appel à nos équipes. Nous réalisons l'ensemble des travaux de peinture, de la préparation à la finition.`,
    },
    {
      title: 'Les aides financières pour la rénovation énergétique en 2025',
      slug: 'aides-financieres-renovation-energetique-2025',
      excerpt:
        "Découvrez toutes les aides disponibles pour financer vos travaux de rénovation énergétique : MaPrimeRénov', CEE, éco-PTZ et aides locales.",
      category: 'aides',
      tags: ['rénovation', 'aides financières', 'énergie', 'MaPrimeRénov'],
      published: true,
      publishedAt: new Date().toISOString(),
      metaTitle:
        "Aides Rénovation Énergétique 2025 : MaPrimeRénov', CEE, Éco-PTZ",
      metaDescription:
        "Guide complet des aides financières pour la rénovation énergétique en 2025. MaPrimeRénov', CEE, éco-prêt à taux zéro. Conditions et montants.",
      content: `## Les principales aides en 2025

La rénovation énergétique de votre logement peut bénéficier de nombreuses aides financières. Voici un tour d'horizon complet.

## MaPrimeRénov'

### Qu'est-ce que c'est ?

MaPrimeRénov' est la principale aide de l'État pour la rénovation énergétique. Elle est accessible à tous les propriétaires, quels que soient leurs revenus.

### Travaux éligibles

- Isolation thermique (murs, toiture, planchers)
- Remplacement de fenêtres
- Installation de chauffage performant
- Ventilation

### Montants

Les montants varient selon vos revenus et le type de travaux :
- **Ménages très modestes** : jusqu'à 90% du montant des travaux
- **Ménages modestes** : jusqu'à 75%
- **Ménages intermédiaires** : jusqu'à 60%
- **Ménages aisés** : jusqu'à 40%

## Certificats d'Économies d'Énergie (CEE)

Les CEE sont des primes versées par les fournisseurs d'énergie pour financer vos travaux d'économies d'énergie. Ils sont cumulables avec MaPrimeRénov'.

## Éco-Prêt à Taux Zéro (éco-PTZ)

L'éco-PTZ permet d'emprunter jusqu'à **50 000 euros** à taux zéro pour financer des travaux de rénovation énergétique. Aucune condition de revenus.

## Aides locales en Hauts-de-Seine

Le département des Hauts-de-Seine et certaines communes proposent des aides complémentaires :
- **Aide départementale** pour l'amélioration de l'habitat
- **Subventions communales** selon votre ville (Issy-les-Moulineaux, Boulogne-Billancourt, Meudon...)

## Comment en bénéficier ?

1. **Faites réaliser un audit énergétique** pour identifier les travaux prioritaires
2. **Choisissez un artisan RGE** (Reconnu Garant de l'Environnement)
3. **Déposez vos demandes d'aide** avant le début des travaux
4. **Réalisez les travaux** avec l'artisan choisi
5. **Transmettez les factures** pour obtenir le versement

## Atouts Services vous accompagne

Nous vous aidons à identifier les travaux éligibles et à constituer vos dossiers d'aide. Contactez-nous pour un diagnostic gratuit.`,
    },
    {
      title: '5 tendances déco pour votre salle de bains en 2025',
      slug: 'tendances-deco-salle-de-bains-2025',
      excerpt:
        'Inspiration pour votre future salle de bains : matériaux naturels, douche italienne, couleurs terracotta et bien plus.',
      category: 'tendances',
      tags: ['salle de bains', 'décoration', 'tendances', '2025'],
      published: true,
      publishedAt: new Date().toISOString(),
      metaTitle:
        '5 Tendances Déco Salle de Bains 2025 | Inspiration & Idées',
      metaDescription:
        'Découvrez les 5 tendances déco incontournables pour votre salle de bains en 2025 : matériaux naturels, couleurs chaudes, douche italienne.',
      content: `## Les tendances qui transforment la salle de bains

La salle de bains n'est plus un simple espace fonctionnel. En 2025, elle devient un véritable lieu de bien-être. Voici les 5 tendances à suivre.

## 1. Les matériaux naturels

Le bois, la pierre naturelle et le terrazzo font une entrée en force dans la salle de bains :
- **Vasques en pierre** : un élément sculptural qui apporte du caractère
- **Meubles en bois massif** : traités pour résister à l'humidité
- **Sol en terrazzo** : un classique revisité, durable et élégant

## 2. La douche italienne XXL

La douche à l'italienne reste LA référence, mais en version plus spacieuse :
- Dimensions généreuses (au moins 120x90 cm)
- Paroi vitrée minimaliste
- Receveur extra-plat encastré
- Robinetterie encastrée dans le mur

## 3. Les couleurs terracotta et sauge

Fini le tout-blanc ! Les couleurs chaudes et naturelles s'imposent :
- **Terracotta** : chaleureux et intemporel
- **Vert sauge** : apaisant et naturel
- **Bleu profond** : pour un effet cocooning
- Associées à des tons neutres (beige, blanc cassé)

## 4. L'éclairage d'ambiance

L'éclairage joue un rôle essentiel dans l'atmosphère de la salle de bains :
- **Miroir rétroéclairé** : fonctionnel et décoratif
- **Spots encastrés** avec variateur d'intensité
- **Bandeau LED** sous le meuble vasque
- Éclairage chaud (2700K à 3000K)

## 5. Le rangement invisible

La tendance est à l'épure et aux lignes nettes :
- **Niches encastrées** dans la douche
- **Colonnes de rangement** intégrées au mur
- **Meubles suspendus** pour libérer le sol
- Portes push-to-open sans poignées

## Réalisez votre projet avec Atouts Services

Nos équipes maîtrisent toutes ces tendances et les adaptent à votre espace et votre budget. De la conception à la réalisation, nous transformons votre salle de bains en un espace de bien-être sur mesure.

Contactez-nous pour discuter de votre projet et obtenir un devis gratuit.`,
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
