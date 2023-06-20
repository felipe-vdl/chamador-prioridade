import { type NextPage } from "next";
import Head from "next/head";

import Image from "next/image";
import { api } from "@/utils/api";
import { useState } from "react";
import type {
  CurrentCommonPassword,
  CurrentPriorityPassword,
} from "@prisma/client";

const Home: NextPage = () => {
  /* Voice Function */
  const chamar = (
    { message, password }: Pick<CurrentCommonPassword, "message" | "password">,
    type: "common" | "priority"
  ) => {
    const voices = window.speechSynthesis.getVoices();
    const newSpeech = new SpeechSynthesisUtterance(
      type === "common"
        ? `Comum ${password}, ${message ? `guichê: ${message}` : ""}.`
        : `Prioridade ${password}, ${message ? `guichê: ${message}` : ""}.`
    );
    newSpeech.voice = voices[0] as SpeechSynthesisVoice;
    window.speechSynthesis.speak(newSpeech);
  };

  /* Senha Comum */
  const [commonInfo, setCommonInfo] = useState<Pick<
    CurrentCommonPassword,
    "message" | "password"
  > | null>(null);
  api.password.currentCommonPassword.useQuery(undefined, {
    onSuccess: (data) => {
      setCommonInfo(data);
    },
  });
  api.password.commonSubscription.useSubscription(undefined, {
    onData: (data) => {
      setCommonInfo(data);
      chamar(data, "common");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  /* Senha Prioridade */
  const [priorityInfo, setPriorityInfo] = useState<Pick<
    CurrentPriorityPassword,
    "message" | "password"
  > | null>(null);
  api.password.currentPriorityPassword.useQuery(undefined, {
    onSuccess: (data) => {
      setPriorityInfo(data);
    },
  });
  api.password.prioritySubscription.useSubscription(undefined, {
    onData: (data) => {
      setPriorityInfo(data);
      chamar(data, "priority");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <>
      <Head>
        <title>Painel</title>
        <meta name="description" content="Painel de chamada." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-1 flex-col">
        <Image
          width={250}
          height={83}
          alt="Logotipo da Prefeitura de Mesquita"
          src="/logo.png"
          className="mb-3 ml-5 mt-5 w-[250px] self-center sm:self-center md:self-start"
        />
        <h2 className="mt-auto text-center text-xl">Chamada</h2>
        <div className="flex w-full flex-col justify-around pb-4 lg:flex-row lg:pb-0">
          {/* Senha Comum */}
          <div className="flex-1">
            <div
              className={`m-auto mb-0 mt-3 w-[95%] rounded rounded-b-none border-4 ${
                commonInfo?.message ? "border-b-2" : ""
              } border-slate-800 bg-blue-300 text-center font-bold text-slate-800`}
            >
              <h2 className="bg-slate-800/90 py-2 text-[50px] text-white">
                COMUM
              </h2>
              <h2 className="text-[160px]">{commonInfo?.password}</h2>
            </div>
            {commonInfo?.message && (
              <div className="mx-auto w-[95%] rounded rounded-t-none border-4 border-t-0 border-slate-800 bg-blue-300 p-4 text-center text-[80px] font-bold text-slate-800">
                Guichê: {commonInfo?.message}
              </div>
            )}
          </div>
          {/* Prioridade */}
          {!!process.env.NEXT_PUBLIC_ENABLE_PRIORITY && (
            <div className="flex-1">
              <div
                className={`m-auto mb-0 mt-3 w-[95%] rounded rounded-b-none border-4 ${
                  priorityInfo?.message ? "border-b-2" : ""
                } border-slate-800 bg-amber-300 text-center font-bold text-slate-800`}
              >
                <h2 className="bg-slate-800/90 py-2 text-[50px] text-white">
                  PRIORIDADE
                </h2>
                <h2 className="text-[160px]">{priorityInfo?.password}</h2>
              </div>
              {priorityInfo?.message && (
                <div className="mx-auto w-[95%] rounded rounded-t-none border-4 border-t-0 border-slate-800 bg-amber-300 p-4 text-center text-[80px] font-bold text-slate-800">
                  Guichê: {priorityInfo?.message}
                </div>
              )}
            </div>
          )}
        </div>
        <footer className="mt-auto bg-indigo-800 p-1 text-center text-xs text-white">
          2023 © Subsecretaria de Tecnologia da Informação — Prefeitura
          Municipal de Mesquita
        </footer>
      </div>
    </>
  );
};

export default Home;
