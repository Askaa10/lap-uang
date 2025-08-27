export class BaseResponse {
  _success({
    message = { en: 'Success', id: 'Berhasil' },
    data = null,
    statusCode = 200,
    statusText = 'OK',
    included = [],
    meta = {},
    pagination = null,
    links = {},
    auth = null,
    errors = null,
    others = {}
  } = {}) {
    const timestamp = new Date().toISOString();
    const traceId =
      crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);

    return {
      success: true,
      message,
      code: statusCode,
      status: statusText,
      timestamp,
      locale: 'id',
      data,
      included,
      total_data: Array.isArray(data) ? data.length : 1,
      meta: {
        request_id: traceId,
        trace_id: traceId,
        execution_time_ms: 0, // hitung pakai performance.now() jika mau
        api_version: 'v2.0.0',
        environment: process.env.NODE_ENV || 'development',
        auth: auth || null,
        debug:
          process.env.NODE_ENV !== 'production'
            ? {
                memory_usage_mb:
                  Math.round(
                    (process.memoryUsage().heapUsed / 1024 / 1024) * 100,
                  ) / 100,
                worker_node: process.pid,
              }
            : null,
        ...meta,
      },
      pagination,
      errors,
      links,
      others
    };
  }
}
