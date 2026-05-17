export class TypedFetchError<T = unknown>
  extends Error
  implements IApiError<T>
{
  in_sucesso = false;

  cd_erro: number;

  ds_mensagem: string;

  data?: T;

  constructor(params: { cd_erro: number; ds_mensagem: string; data?: T }) {
    super(params.ds_mensagem);

    this.name = "TypedFetchError";

    this.cd_erro = params.cd_erro;

    this.ds_mensagem = params.ds_mensagem;

    this.data = params.data;
  }
}
