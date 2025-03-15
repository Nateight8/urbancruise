import { Router, Request, Response } from "express";

const instagramRouter = Router();

interface InstagramWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    time: number;
    changes: Array<{
      field: string;
      value: any;
    }>;
  }>;
}

// POST endpoint for handling webhook events
instagramRouter.post(
  "/",
  (req: Request<{}, {}, InstagramWebhookPayload>, res: Response) => {
    console.log("Received Instagram Webhook POST");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body:", JSON.stringify(req.body, null, 2));

    res.json({ message: "Instagram Webhook Received" });
  }
);

// GET endpoint for verifying webhook
instagramRouter.get("/", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"] as string;
  const token = req.query["hub.verify_token"] as string;
  const challenge = req.query["hub.challenge"] as string;

  if (mode === "subscribe" && token === "12345") {
    console.log("Instagram Webhook Verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

export default instagramRouter;
