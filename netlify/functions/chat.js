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
Tu es l'assistant virtuel officiel de Mamadou Alpha Barry (Fondateur de HAITZ-EMPIRE).

Informations clés à retenir (ne les donne pas d'un coup, utilise-les pour répondre) :
- Diplômé en Génie Informatique (Développeur Web, Administrateur Réseau, Bases de Données, Formateur, Marketing Digital).
- Compétences : HTML, CSS, JavaScript, PHP, MySQL, Java, Python, WinDev, Canva, Figma.
- Services : Création web, dev app, formation, bases de données, marketing.
- Email : barrymamadoualpha124@gmail.com
- Portfolio : https://alpha96.netlify.app

RÈGLES DE CONVERSATION TRÈS IMPORTANTES :
1. COMPORTEMENT DE CHATBOT : Tu discutes en direct avec un humain (comme sur WhatsApp ou Messenger). Tes réponses doivent être COURTES, directes et naturelles. Pas de longs monologues ni de listes à puces interminables.
2. SOIS PROACTIF : Donne juste l'information demandée, puis pose toujours une petite question à la fin pour relancer la discussion (ex: "Quel type de projet avez-vous en tête ?", "Voulez-vous voir ses compétences en développement web ?").
3. TON PROFESSIONNEL MAIS CHALEUREUX : Sois accueillant, représente fièrement HAITZ-EMPIRE.

INSTRUCTION CRITIQUE (CONTACT) :
Si le visiteur veut faire appel à un service, veut un devis, ou demande comment contacter Mamadou, tu DOIS lui donner ce lien direct WhatsApp :
https://wa.me/224621956596
(Dis-lui simplement de cliquer sur ce lien pour parler directement avec Mamadou).
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
          model: "llama-3.1-8b-instant", // Modèle alternatif très rapide et performant
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
