# Questionnaire Flowmerce — marchands e-commerce

Source de vérité du formulaire. Ne pas modifier l'ordre, les options ni les conditions.

Légende :
- *(choix unique)* = un seul choix possible
- *(choix multiples)* = plusieurs choix possibles
- « Autre : [champ texte] » = affiche un champ texte quand l'option est cochée

---

## 1. Combien de commandes par jour en moyenne ? *(choix unique)*
- Moins de 10
- 10 – 20
- 20 – 50
- 50 – 100
- 100 – 200
- Plus de 200

## 2. Quelle plateforme utilises-tu ? *(choix multiples)*
- YouCan
- Shopify
- WooCommerce
- Pas de site (Facebook / Instagram / WhatsApp uniquement)
- Autre : [champ texte]

## 3. Avec quel livreur ? *(choix multiples)*
- Yalidine
- ZR Express
- Maystro Delivery
- Noest
- Livreur indépendant / propre livreur
- Autre : [champ texte]

## 4. Combien de confirmatrices ? *(choix unique)*
- Aucune, je confirme moi-même
- 1
- 2 – 3
- 4 ou plus

## 5. Où sont notées les commandes ? *(choix multiples)*
- Google Sheets
- Excel
- Dashboard de la plateforme (YouCan, Shopify…)
- Dashboard du livreur
- Cahier / papier
- Autre : [champ texte]

## 6. Quelles sont les choses qui te fatiguent le plus après la réception d'une commande ? *(champs texte dynamiques)*
- Problème n°1 (obligatoire)
- Bouton « + Ajouter un problème », 5 maximum
- Stockage : une seule colonne dans le Sheet, valeurs séparées par ` | `
- Aucune suggestion, aucun exemple dans les placeholders

## 7. Pour le problème n°1 : la dernière fois que c'est arrivé, que s'est-il passé exactement ? *(zone de texte, facultative)*
- Le libellé affiche dynamiquement le problème n°1 saisi en Q6

## 8. Qu'as-tu fait pour le résoudre ? *(zone de texte, facultative)*

## 9. La semaine dernière, combien de commandes fausses ou niées (« je n'ai rien commandé ») ? *(choix unique)*
- 0
- 1 – 5
- 6 – 15
- 16 – 30
- Plus de 30
- Je ne sais pas

## 10. La semaine dernière, combien de colis retournés ? *(choix unique)*
- 0
- 1 – 5
- 6 – 15
- 16 – 30
- Plus de 30
- Je ne sais pas

## 11. La semaine dernière, combien de réclamations clients après livraison ? *(choix unique)*
- 0
- 1 – 5
- 6 – 15
- 16 – 30
- Plus de 30
- Je ne sais pas

## 12. Pour quelles raisons tes clients font-ils une réclamation ? *(choix multiples)*
- Produit abîmé ou défectueux
- Mauvaise taille / couleur / modèle
- Produit différent de la photo ou de la pub
- Colis incomplet
- Retard de livraison
- Autre : [champ texte]

## 13. Comment le client te contacte-t-il pour une réclamation ? *(choix multiples)*
- Appel téléphonique
- WhatsApp
- Messenger / Instagram
- Via le livreur
- Autre : [champ texte]

## 14. Que fais-tu le plus souvent face à une réclamation ? *(choix multiples)*
- Échange du produit
- Renvoi d'un nouveau produit
- Remboursement
- Geste commercial (réduction sur la prochaine commande)
- Je refuse la réclamation
- Autre : [champ texte]

## 15. Où notes-tu les réclamations ? *(choix multiples)*
- Nulle part
- Google Sheets / Excel
- Dans les conversations WhatsApp / Messenger
- Cahier / papier
- Dans un outil
- Autre : [champ texte]

## 16. Combien de temps par semaine passes-tu à gérer les réclamations ? *(choix unique)*
- Moins d'1 h
- 1 – 3 h
- 3 – 5 h
- Plus de 5 h
- Je ne sais pas

## 17. Combien te coûte un colis retourné (frais de livraison aller + frais de retour), en DA ? *(champ numérique)*
- Case : « Je ne sais pas »

## 18. Comment repères-tu une fausse commande ? *(choix multiples)*
- Le client ne répond pas à l'appel de confirmation
- Numéro déjà connu / déjà signalé
- Adresse incomplète ou incohérente
- Historique du client chez le livreur
- Je ne la repère pas avant l'envoi
- Autre : [champ texte]

## 19. As-tu une liste noire de numéros ? *(choix unique)*
- Oui, dans un Sheet / Excel
- Oui, dans mon téléphone ou sur papier
- Oui, via un outil ou mon livreur
- Non

## 20. Partages-tu des numéros de fraudeurs avec d'autres marchands ? *(choix unique)*
- Oui, régulièrement (groupe WhatsApp, Facebook…)
- Oui, de temps en temps
- Non

## 21. Comment saisis-tu les commandes chez le livreur ? *(choix unique)*
- À la main, commande par commande
- Import d'un fichier (Excel / CSV)
- Automatique depuis ma plateforme
- Je ne sais pas, c'est la confirmatrice qui s'en occupe

## 22. Combien de temps par jour pour cette saisie ? *(choix unique)*
- Condition : afficher seulement si Q21 = « À la main » ou « Import d'un fichier »
- Moins de 30 min
- 30 min – 1 h
- 1 – 2 h
- Plus de 2 h

## 23. Quels outils ou applications utilises-tu pour ton activité ? *(champ texte libre)*
- Placeholder : « Ex. : noms des applications, séparés par des virgules »

## 24. Combien paies-tu par mois pour ces outils, au total, en DA ? *(champ numérique)*
- Case : « Rien, je n'utilise que du gratuit »

## 25. As-tu essayé un outil puis abandonné ? *(choix unique)*
- Oui → champ texte : « Lequel ? »
- Non

## 26. Pourquoi l'as-tu abandonné ? *(zone de texte libre)*
- Condition : afficher seulement si Q25 = Oui
- Aucune suggestion

## 27. Connais-tu un autre marchand qui pourrait répondre à ce questionnaire ?
- Bouton « Partager sur WhatsApp », avec le lien du formulaire pré-rempli dans le message
- Aucune collecte de données du tiers

## 28. Je t'envoie le résumé des résultats. Puis-je te recontacter ? *(choix unique)*
- Oui
- Non
- Si Oui, afficher : Nom de la boutique / page, Prénom, Téléphone (WhatsApp)
