import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TabsTextArea from "./components/TabsTextArea";
import TabsFileUpload from "./components/TabsFileUpload";
import AddForm from "./components/TabsForm";

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-4xl mx-auto">
      <section className="lg:col-span-2 bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold mb-6">ClientBook</h1>

      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid grid-cols-3 w-[400px] mb-4">
          <TabsTrigger value="form">Form Input</TabsTrigger>
          <TabsTrigger value="textarea">Text Area</TabsTrigger>
          <TabsTrigger value="file">Upload File</TabsTrigger>
        </TabsList>

        <TabsContent value="form"><AddForm /></TabsContent>
        <TabsContent value="textarea"><TabsTextArea /></TabsContent>
        <TabsContent value="file"><TabsFileUpload /></TabsContent>
      </Tabs>
      </section>
    </div>
  );
}
