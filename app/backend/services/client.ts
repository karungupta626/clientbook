import Client from "../models/client";

export default {
  async createClient(data: any) {
    return await Client.create(data);
  },

  async getClients() {
    return await Client.find().sort({ created_at: -1 });
  },

  async getClientById(id: string) {
    return await Client.findById(id);
  },

  async updateClient(id: string, updated: any) {
    return await Client.findByIdAndUpdate(id, updated, { new: true });
  },

  async deleteClient(id: string) {
    return await Client.findByIdAndDelete(id);
  }
};
