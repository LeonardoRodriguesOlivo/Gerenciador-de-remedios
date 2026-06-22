// Integração com a Bulapi (https://bulapi.com.br) — base de dados aberta
// de medicamentos brasileiros (ANVISA/CMED), pública e sem autenticação.
// Documentação: https://bulapi.com.br/docs/openapi.yaml

const BULAPI_BASE = 'https://bulapi.com.br/api/v1';

async function fetchBulapi(url, requestName) {
  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`${requestName}: falha de rede ao conectar na Bulapi`);
  }

  if (!response.ok) {
    throw new Error(`${requestName} falhou com status ${response.status}`);
  }

  return response.json();
}

// A Bulapi não tem um endpoint de busca de produtos por nome em /products
// (esse endpoint só lista produtos paginados). Quem faz busca textual por
// nome de medicamento é o endpoint /search?q=, que retorna produtos e
// substâncias relacionadas ao termo buscado.
export async function searchProductsByName(query) {
  if (!query?.trim()) {
    return [];
  }

  const url = `${BULAPI_BASE}/search?q=${encodeURIComponent(query.trim())}`;
  const json = await fetchBulapi(url, 'Busca Bulapi');
  return json?.data?.products || [];
}

export async function fetchProductById(productId) {
  if (!productId) {
    return null;
  }

  const url = `${BULAPI_BASE}/products/${encodeURIComponent(productId)}`;
  const json = await fetchBulapi(url, 'Detalhe do produto Bulapi');
  return json?.data || null;
}

export async function fetchProductPresentations(productId) {
  if (!productId) {
    return [];
  }

  const url = `${BULAPI_BASE}/products/${encodeURIComponent(productId)}/presentations`;
  const json = await fetchBulapi(url, 'Apresentações Bulapi');
  return json?.data || [];
}
