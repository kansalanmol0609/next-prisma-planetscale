// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

type Data = {
	message?: string;
	error?: string;
	success: boolean;
};

const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method === "POST") {
		return await addBook(req, res);
	} else if (req.method === "GET") {
		return await readBooks(req, res);
	} else {
		return res
			.status(405)
			.json({ message: "Method not allowed", success: false });
	}
}

async function readBooks(req, res) {
	const body = req.body;

	try {
		const allBooks = await prisma.bookSuggestion.findMany();

		return res.status(200).json(allBooks, { success: true });
	} catch (error) {
		console.log(error);

		return res
			.status(500)
			.json({ error: "Error reading from database", success: false });
	}
}

async function addBook(req: NextApiRequest, res: NextApiResponse<Data>) {
	const body = req.body;
	try {
		const newEntry = await prisma.bookSuggestion.create({
			data: {
				bookTitle: body.title,
				bookAuthor: body.author,
				bookGenre: body.genre,
			},
		});
		return res.status(200).json(newEntry, { success: true });
	} catch (error) {
		console.error("Request error", error);
		res.status(500).json({ error: "Error adding book", success: false });
	}
}
