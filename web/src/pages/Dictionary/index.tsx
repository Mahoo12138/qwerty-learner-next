import { Main } from "@/components/layouts/Main";
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from "@tabler/icons-react";
import { useState } from "react";

const options = [
  { id: "en", name: "英语" },
  { id: "ja", name: "日语" },
  { id: "de", name: "德语" },
  { id: "kk", name: "哈萨克语" },
  { id: "id", name: "印尼语" },
  { id: "code", name: "Code" },
];

const dictText = new Map<string, string>([
  ["all", "All Dictionaries"],
  ["all-my", "All My Dictionaries"],
  ["collected", "Collected Dictionaries"],
]);
const DictionaryPage = () => {
  const [sort, setSort] = useState("ascending");
  const [dictType, setDcitType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <Main>

    </Main>
  );
};

export default DictionaryPage;
