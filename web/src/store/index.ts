import atomForConfig from "./atomForConfig";
import { reviewInfoAtom } from "./reviewInfoAtom";
import {
  DISMISS_START_CARD_DATE_KEY,
  defaultFontSizeConfig,
} from "@/constants";
import { idDictionaryMap } from "@/resources/dictionary";
import {
  correctSoundResources,
  keySoundResources,
  wrongSoundResources,
} from "@/resources/soundResource";
import type {
  Dictionary,
  InfoPanelState,
  LoopWordTimesOption,
  PhoneticType,
  PronunciationType,
  WordDictationOpenBy,
  WordDictationType,
} from "@/typings";
import type { ReviewRecord } from "@/utils/db/record";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const currentDictIdAtom = atomWithStorage("currentDict", "");
export const publicDictListAtom = atom<Dictionary[]>([]);

export const currentDictInfoAtom = atom<Dictionary | null>((get) => {
  const currentDictId = get(currentDictIdAtom);
  const dictList = get(publicDictListAtom);
  if (!dictList || dictList.length === 0) return null;

  const currentDict = dictList.find((dict) => dict.id === currentDictId);
  return currentDict || dictList[0]; // 匹配不到则取第一个词典
});

export const currentChapterAtom = atomWithStorage("currentChapter", 0);

export const loopWordConfigAtom = atomForConfig<{ times: LoopWordTimesOption }>(
  "loopWordConfig",
  {
    times: 1,
  }
);

export const keySoundsConfigAtom = atomForConfig("keySoundsConfig", {
  isOpen: true,
  isOpenClickSound: true,
  volume: 1,
  resource: keySoundResources[0],
});

export const hintSoundsConfigAtom = atomForConfig("hintSoundsConfig", {
  isOpen: true,
  volume: 1,
  isOpenWrongSound: true,
  isOpenCorrectSound: true,
  wrongResource: wrongSoundResources[0],
  correctResource: correctSoundResources[0],
});

export const pronunciationConfigAtom = atomForConfig("pronunciation", {
  isOpen: true,
  volume: 1,
  type: "us" as PronunciationType,
  name: "美音",
  isLoop: false,
  isTransRead: false,
  transVolume: 1,
  rate: 1,
});

export const fontSizeConfigAtom = atomForConfig(
  "fontsize",
  defaultFontSizeConfig
);

export const pronunciationIsOpenAtom = atom(
  (get) => get(pronunciationConfigAtom).isOpen
);

export const pronunciationIsTransReadAtom = atom(
  (get) => get(pronunciationConfigAtom).isTransRead
);

export const randomConfigAtom = atomForConfig("randomConfig", {
  isOpen: false,
});

export const isShowPrevAndNextWordAtom = atomWithStorage(
  "isShowPrevAndNextWord",
  true
);

export const isIgnoreCaseAtom = atomWithStorage("isIgnoreCase", true);

export const isShowAnswerOnHoverAtom = atomWithStorage(
  "isShowAnswerOnHover",
  true
);

export const isTextSelectableAtom = atomWithStorage("isTextSelectable", false);

export const reviewModeInfoAtom = reviewInfoAtom({
  isReviewMode: false,
  reviewRecord: undefined as ReviewRecord | undefined,
});
export const isReviewModeAtom = atom(
  (get) => get(reviewModeInfoAtom).isReviewMode
);

export const phoneticConfigAtom = atomForConfig("phoneticConfig", {
  isOpen: true,
  type: "us" as PhoneticType,
});

export const isOpenDarkModeAtom = atomWithStorage(
  "isOpenDarkModeAtom",
  window.matchMedia("(prefers-color-scheme: dark)").matches
);

export const isShowSkipAtom = atom(false);

export const isInDevModeAtom = atom(false);

export const infoPanelStateAtom = atom<InfoPanelState>({
  donate: false,
  vsc: false,
  community: false,
  redBook: false,
});

export const wordDictationConfigAtom = atomForConfig("wordDictationConfig", {
  isOpen: false,
  type: "hideAll" as WordDictationType,
  openBy: "auto" as WordDictationOpenBy,
});

export const dismissStartCardDateAtom = atomWithStorage<Date | null>(
  DISMISS_START_CARD_DATE_KEY,
  null
);

// for dev test
//   dismissStartCardDateAtom = atom<Date | null>(new Date())
