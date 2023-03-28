import { type NextPage } from "next";
import Head from "next/head";

import Image from "next/image";
import { api } from "@/utils/api";

const SenhaPage: NextPage = () => {
  /* Comum */
  const commonPasswordMutation = api.password.newCommonPassword.useMutation({
    onSuccess: (data) => {
      const win = window.open();
      if (win) {
        win.blur();
        window.focus();
        win.document.write(
          '<html><head><title>Senha</title></head><body style="line-height: 3.5rem; margin: 0; padding: 0; display: flex; flex-direction: column; justify-content: flex-start;">'
        );
        win.document.write(
          `<p style="font-size: 12px; text-align: center; margin: 0; padding: 0;">${new Date(
            data.createdAt
          ).toLocaleDateString("pt-br", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}<p>`
        );
        win.document.write(
          `<h1 style="font-size: 120px; text-align: center; margin: 0; padding: 0;">${data.id}<h1>`
        );
        win.document.write(
          `<h2 style="font-size: 40px; text-align: center; margin: 0; padding: 0;">COMUM<h2>`
        );
        win.document.write("</body></html>");
        win.print();
        win.close();
      }
    },
  });

  /* Prioridade */
  const priorityPasswordMutation = api.password.newPriorityPassword.useMutation(
    {
      onSuccess: (data) => {
        const win = window.open();
        if (win) {
          win.blur();
          window.focus();
          win.document.write(
            '<html><head><title>Senha</title></head><body style="line-height: 3.5rem; margin: 0; padding: 0; display: flex; flex-direction: column; justify-content: flex-start;">'
          );
          win.document.write(
            `<p style="font-size: 12px; text-align: center; margin: 0; padding: 0;">${new Date(
              data.createdAt
            ).toLocaleDateString("pt-br", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}<p>`
          );
          win.document.write(
            `<h1 style="font-size: 120px; text-align: center; margin: 0; padding: 0;">${data.id}<h1>`
          );
          win.document.write(
            `<h2 style="font-size: 40px; text-align: center; margin: 0; padding: 0;">PRIORIDADE<h2>`
          );
          win.document.write("</body></html>");
          win.print();
          win.close();
        }
      },
    }
  );

  return (
    <>
      <Head>
        <title>Impressão de Senhas</title>
        <meta name="description" content="Impressão de senhas." />
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
        <h1 className="mt-auto mb-5 self-center bg-blue-100 px-12 py-2 text-center text-3xl shadow">
          Clique no botão para imprimir uma senha
        </h1>
        <div className="flex lg:flex-row flex-col w-full justify-around gap-8 px-8">
          <button
            onClick={() => commonPasswordMutation.mutate()}
            className="w-full lg:w-auto flex-1  mb-auto self-center rounded bg-indigo-800 p-2 px-8 text-[70px] font-bold text-white shadow-lg shadow-indigo-500 transition hover:scale-105 hover:bg-blue-900 hover:text-blue-100 hover:shadow-blue-500 active:bg-blue-700 disabled:bg-indigo-300 disabled:text-slate-100"
            disabled={commonPasswordMutation.isLoading}
          >
            {!commonPasswordMutation.isLoading ? "Comum" : "Imprimindo..."}
          </button>
          <button
            onClick={() => priorityPasswordMutation.mutate()}
            className="w-full lg:w-auto flex-1  mb-auto self-center rounded bg-yellow-800 p-2 px-8 text-[70px] font-bold text-white shadow-lg shadow-yellow-500 transition hover:scale-105 hover:bg-amber-900 hover:text-amber-100 hover:shadow-amber-500 active:bg-amber-700 disabled:bg-yellow-300 disabled:text-slate-100"
            disabled={priorityPasswordMutation.isLoading}
          >
            {!priorityPasswordMutation.isLoading
              ? "Prioridade"
              : "Imprimindo..."}
          </button>
        </div>
        <footer className="mt-auto bg-indigo-800 p-1 text-center text-xs text-white shadow-inner shadow-indigo-800">
          2023 © Subsecretaria de Tecnologia da Informação — Prefeitura
          Municipal de Mesquita
        </footer>
      </div>
    </>
  );
};

export default SenhaPage;
