Consignes

La carte

Créez une carte de 10x10 cases représentant le monde du jeu. Son initialisation sera aléatoire à chaque chargement de nouvelle partie. Chaque case peut être soit :

Vide
Inaccessible (grisée)
Les armes

Sur la carte, un nombre limité d’armes (4 maximum) sera placé aléatoirement et pourra être récolté par les joueurs qui passeraient dessus.

Vous inventerez au moins 4 types d’arme dans le jeu, avec des dégâts différents. L’arme par défaut qui équipe les joueurs doit infliger 10 points de dégâts. Chaque arme a un nom et un visuel associé.

Le placement initial

Le placement des deux joueurs est lui aussi aléatoire sur la carte au chargement de la partie. Ils ne doivent pas se toucher.

Les déplacements

A chaque tour, un joueur peut se déplacer d’une à trois cases (horizontalement ou verticalement) avant de terminer son tour.

Le changement d'armes

Si un joueur passe sur une case contenant une arme, il laisse son arme actuelle sur place et la remplace par la nouvelle.

La rencontre entre 2 joueurs

Si les joueurs se croisent sur des cases adjacentes (horizontalement ou verticalement), un combat à mort s’engage.

La situation de combat

Chacun attaque à son tour
Les dégâts infligés dépendent de l’arme possédée par le joueur
Le joueur peut choisir d’attaquer ou de se défendre contre le prochain coup
Lorsque le joueur se défend, il encaisse 50% de dégâts en moins qu’en temps normal
Dès que les points de vie d’un joueur (initialement à 100) tombent à 0 , celui-ci a perdu. Un message s’affiche et la partie est terminée.
Consignes techniques

Le jeu doit fonctionner entièrement dans un navigateur web (pas de code backend). La carte sera dessinée par le moyen technique de votre choix.

Vous utiliserez donc extensivement JavaScript pour ce projet en soignant tout particulièrement la qualité du code :

Vous utiliserez la programmation orientée objet
Vous éviterez de mélanger les calculs "métier" du jeu (est-ce que le joueur a le droit d'aller sur cette case ?) avec la mise à jour de l'interface (déplacer l'image du joueur dans la case B6)
Vous séparerez autant que possible les codes ayant des rôles différents dans des fichiers JavaScript différents (ex : un fichier pour la mise à jour de l'interface, un fichier pour la gestion de la carte, un fichier pour la gestion des combats...)