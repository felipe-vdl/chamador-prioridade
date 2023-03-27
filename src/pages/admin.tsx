import { type NextPage } from "next";
import Head from "next/head";

import Image from "next/image";
import { api } from "@/utils/api";
import { useState } from "react";
import type {
  CurrentCommonPassword,
  CurrentPriorityPassword,
} from "@prisma/client";

const Admin: NextPage = () => {
  /* Senha Comum */
  const [commonTotal, setCommonTotal] = useState<number>(0);
  const [commonMessageInput, setCommonMessageInput] = useState("");
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
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const callCommonMutation = api.password.callCommonPassword.useMutation({});
  const handleCallCommon = (sum: number) => {
    callCommonMutation.mutate({
      password: (commonInfo?.password ?? 0) + sum,
      message: commonMessageInput,
    });
  };

  /* Senha Prioridade */
  const [priorityTotal, setPriorityTotal] = useState<number>(0);
  const [priorityMessageInput, setPriorityMessageInput] = useState("");
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
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const callPriorityMutation = api.password.callPriorityPassword.useMutation(
    {}
  );
  const handleCallPriority = (sum: number) => {
    callPriorityMutation.mutate({
      password: (priorityInfo?.password ?? 0) + sum,
      message: priorityMessageInput,
    });
  };

  api.password.totalCommonSubscription.useSubscription(undefined, {
    onData: (data) => {
      setCommonTotal(data);
    },
  });
  api.password.totalPrioritySubscription.useSubscription(undefined, {
    onData: (data) => {
      setPriorityTotal(data);
    },
  });
  api.password.currentTotals.useQuery(undefined, {
    onSuccess: data => {
      setCommonTotal(data.common);
      setPriorityTotal(data.priority);
    }
  })

  return (
    <>
      <Head>
        <title>Administração</title>
        <meta name="description" content="Painel de administração." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-1 flex-col">
        <Image
          width={250}
          height={83}
          alt="Logotipo da Prefeitura de Mesquita"
          src="/logo.png"
          className="mb-3 mt-5 ml-5 w-[250px] self-center sm:self-center md:self-start"
        />
        <div className="flex flex-col lg:flex-row w-full justify-around gap-12 px-8">
          {/* Senha Comum */}
          <div className="flex flex-1 flex-col gap-8">
            <div className="m-auto w-full rounded border-8 border-indigo-800 bg-blue-300 p-8 text-center font-bold text-slate-800 shadow-md shadow-blue-800">
              <p className="text-3xl">Comum</p>
              <span className="text-[96px]">{commonInfo?.password}</span>
              {commonInfo?.message && (
                <p className="text-xl">Guichê: {commonInfo?.message}</p>
              )}
            </div>
            <div className="mx-auto flex flex-col gap-8 px-4 text-white">
              <div className="mx-auto">
                <input
                  name="message"
                  type="text"
                  value={commonMessageInput}
                  onChange={(evt) => setCommonMessageInput(evt.target.value)}
                  placeholder="Número do Guichê"
                  className="ouline-none rounded border-2 border-indigo-800 bg-blue-50 p-2 text-slate-800"
                />
              </div>
              <div className="flex gap-8">
                <button
                  className="mb-auto self-center rounded bg-indigo-800 p-2 px-8 font-bold text-white shadow-lg shadow-indigo-500 transition hover:scale-105 hover:bg-blue-900 hover:text-blue-100 hover:shadow-blue-500 active:bg-blue-700 disabled:bg-indigo-300 disabled:text-slate-100"
                  disabled={callCommonMutation.isLoading}
                  onClick={() => handleCallCommon(-1)}
                >
                  {callCommonMutation.isLoading
                    ? "Chamando..."
                    : "Chamar Anterior"}
                </button>
                <button
                  className="mb-auto self-center rounded bg-indigo-800 p-2 px-8 font-bold text-white shadow-lg shadow-indigo-500 transition hover:scale-105 hover:bg-blue-900 hover:text-blue-100 hover:shadow-blue-500 active:bg-blue-700 disabled:bg-indigo-300 disabled:text-slate-100"
                  disabled={callCommonMutation.isLoading}
                  onClick={() => handleCallCommon(0)}
                >
                  {callCommonMutation.isLoading
                    ? "Chamando..."
                    : "Chamar Atual"}
                </button>
                <button
                  className="mb-auto self-center rounded bg-indigo-800 p-2 px-8 font-bold text-white shadow-lg shadow-indigo-500 transition hover:scale-105 hover:bg-blue-900 hover:text-blue-100 hover:shadow-blue-500 active:bg-blue-700 disabled:bg-indigo-300 disabled:text-slate-100"
                  disabled={callCommonMutation.isLoading}
                  onClick={() => handleCallCommon(1)}
                >
                  {callCommonMutation.isLoading
                    ? "Chamando..."
                    : "Chamar Próximo"}
                </button>
              </div>
              <div className="text-center text-slate-800 font-bold text-lg">
                <p>
                  Fila: {commonInfo?.password} de {commonTotal} senhas.
                </p>
                <p>Restam: {commonTotal-(commonInfo?.password ?? 0)}</p>
              </div>
            </div>
          </div>
          {/* Senha Prioridade */}
          <div className="flex flex-1 flex-col gap-8">
            <div className="m-auto w-full rounded border-8 border-yellow-800 bg-amber-300 p-8 text-center font-bold text-slate-800 shadow-md shadow-amber-800">
              <p className="text-3xl">Prioridade</p>
              <span className="text-[96px]">{priorityInfo?.password}</span>
              {priorityInfo?.message && (
                <p className="text-xl">Guichê: {priorityInfo?.message}</p>
              )}
            </div>
            <div className="mx-auto flex flex-col gap-8 px-4 text-white">
              <div className="mx-auto">
                <input
                  name="message"
                  type="text"
                  value={priorityMessageInput}
                  onChange={(evt) => setPriorityMessageInput(evt.target.value)}
                  placeholder="Número do Guichê"
                  className="ouline-none rounded border-2 border-yellow-800 bg-amber-50 p-2 text-slate-800"
                />
              </div>
              <div className="flex gap-8">
                <button
                  className="mb-auto self-center rounded bg-yellow-800 p-2 px-8 font-bold text-white shadow-lg shadow-yellow-500 transition hover:scale-105 hover:bg-amber-900 hover:text-amber-100 hover:shadow-amber-500 active:bg-amber-700 disabled:bg-yellow-300 disabled:text-slate-100"
                  disabled={callPriorityMutation.isLoading}
                  onClick={() => handleCallPriority(-1)}
                >
                  {callPriorityMutation.isLoading
                    ? "Chamando..."
                    : "Chamar Anterior"}
                </button>
                <button
                  className="mb-auto self-center rounded bg-yellow-800 p-2 px-8 font-bold text-white shadow-lg shadow-yellow-500 transition hover:scale-105 hover:bg-amber-900 hover:text-amber-100 hover:shadow-amber-500 active:bg-amber-700 disabled:bg-yellow-300 disabled:text-slate-100"
                  disabled={callPriorityMutation.isLoading}
                  onClick={() => handleCallPriority(0)}
                >
                  {callPriorityMutation.isLoading
                    ? "Chamando..."
                    : "Chamar Atual"}
                </button>
                <button
                  className="mb-auto self-center rounded bg-yellow-800 p-2 px-8 font-bold text-white shadow-lg shadow-yellow-500 transition hover:scale-105 hover:bg-amber-900 hover:text-amber-100 hover:shadow-amber-500 active:bg-amber-700 disabled:bg-yellow-300 disabled:text-slate-100"
                  disabled={callPriorityMutation.isLoading}
                  onClick={() => handleCallPriority(1)}
                >
                  {callPriorityMutation.isLoading
                    ? "Chamando..."
                    : "Chamar Próximo"}
                </button>
              </div>
              <div className="text-center text-slate-800 font-bold text-lg">
                <p>
                  Fila: {priorityInfo?.password} de {priorityTotal} senhas.
                </p>
                <p>Restam: {priorityTotal-(priorityInfo?.password ?? 0)}</p>
              </div>
            </div>
          </div>
        </div>
        <footer className="mt-auto bg-indigo-800 p-1 text-center text-xs text-white">
          2023 © Subsecretaria de Tecnologia da Informação — Prefeitura
          Municipal de Mesquita
        </footer>
      </div>
    </>
  );
};

export default Admin;
