exports.handler = async (event) => {
  try {
    // Vérifier si la méthode est bien POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ reply: "Erreur: Méthode non autorisée." })
      };
    }

    // Récupérer le corps de la requête
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: "Erreur: Le format des données envoyées n'est pas du JSON valide." })
      };
    }

    const { message } = body;

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: "Erreur système: La variable d'environnement GEMINI_API_KEY n'est pas configurée sur Netlify." })
      };
    }

    const prompt = `
Tu es l'assistant officiel de Mamadou alpha Barry.

Fondateur :
Mamadou Alpha Barry

Informations :

- Diplômé en Génie Informatique
- Développeur Web
- Administrateur Réseau
- Gestionnaire de Bases de Données
- Formateur informatique
- Fondateur de HAITZ-EMPIRE

Compétences :

HTML
CSS
JavaScript
PHP
MySQL
Java
Python
WinDev
HFSQL
Canva
Photoshop
Figma
Marketing Digital

Services :

- Création de sites web
- Développement d'applications
- Formation informatique
- Création de bases de données
- Marketing digital

Portfolio :
https://alpha96.netlify.app

Téléphone :
+224 621 956 596

Email :
barrymamadoualpha124@gmail.com

Réponds toujours comme un assistant professionnel représentant HAITZ-EMPIRE.

Question :
${message}
`;

    // Vérifier si 'fetch' existe (au cas où la version Node.js de Netlify serait trop ancienne)
    if (typeof fetch === "undefined") {
        return {
          statusCode: 200,
          body: JSON.stringify({ reply: "Erreur serveur: 'fetch' n'est pas supporté. Veuillez définir la version de Node.js à 18 ou 20 sur Netlify." })
        };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // Si Gemini renvoie une erreur (par exemple clé API invalide)
    if (!response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: `Erreur API Gemini: ${data.error?.message || "Erreur inconnue"}`
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, l'IA n'a renvoyé aucune réponse."
      })
    };

  } catch (error) {
    return {
      statusCode: 200, // On renvoie 200 pour que le client reçoive le texte d'erreur
      body: JSON.stringify({
        reply: `Erreur inattendue du serveur : ${error.message}`
      })
    };
  }
};
