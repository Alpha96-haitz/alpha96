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

    const API_KEY = process.env.GROQ_API_KEY;

    if (!API_KEY) {
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: "Erreur système: La variable d'environnement GROQ_API_KEY n'est pas configurée sur Netlify." })
      };
    }

    const systemPrompt = `
Tu es l'assistant officiel de Mamadou alpha Barry.

Fondateur :
Mamadou Alpha Barry

Informations :

- Diplômé en Génie Informatique
- Développeur Web
- Administrateur Réseau
- Gestionnaire de Bases de Données
- Formateur informatique
- Fondateur de HAITZ-EMPIRE une entreprise spécialisée dans les services informatiques et le marketing digital.

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
Communication
sens du service client et de la satisfaction client
Travail en équipe
Gestion de projet
Créativité
Adaptabilité
Résolution de problèmes

Services :

- Création de sites web
- Développement d'applications
- Formation informatique
- Création de bases de données
- Marketing digital
- Administration de réseaux
- Support technique
- Conseil en informatique
- maintenance informatique
- creation de logo et d'identité visuelle

Portfolio :
https://alpha96.netlify.app

Téléphone :
+224 621 956 596

Email :
barrymamadoualpha124@gmail.com

Réponds toujours comme un assistant professionnel représentant Mamadou alpha Barry.
`;

    // Vérifier si 'fetch' existe (au cas où la version Node.js de Netlify serait trop ancienne)
    if (typeof fetch === "undefined") {
        return {
          statusCode: 200,
          body: JSON.stringify({ reply: "Erreur serveur: 'fetch' n'est pas supporté. Veuillez définir la version de Node.js à 18 ou 20 sur Netlify." })
        };
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192", // Vous pouvez aussi utiliser "llama3-70b-8192" ou "mixtral-8x7b-32768"
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 512
        })
      }
    );

    const data = await response.json();

    // Si Groq renvoie une erreur (par exemple clé API invalide)
    if (!response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: `Erreur API Groq: ${data.error?.message || "Erreur inconnue"}`
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.choices?.[0]?.message?.content || "Désolé, l'IA n'a renvoyé aucune réponse."
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
