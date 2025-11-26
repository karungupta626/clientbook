import clientService from "../services/client";
import { NextRequest, NextResponse } from "next/server";

export const createClient = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const client = await clientService.createClient(body);
    return NextResponse.json({ success: true, data: client });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
};

export const getAllClients = async () => {
  try {
    const clients = await clientService.getClients();
    return NextResponse.json({ success: true, data: clients });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
};
