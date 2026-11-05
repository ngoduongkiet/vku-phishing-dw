// Pre-computed OLAP Aggregates and Warehouse Statistics (235,795 records)
export const WAREHOUSE_METRICS = {
  totalRecords: 235795,
  legitimateCount: 134850,
  legitimatePct: 57.2,
  phishingCount: 100945,
  phishingPct: 42.8,
  httpsParadoxPct: 49.2, // 49.2% phishing websites use HTTPS!
  etlThroughputRowsPerSec: 30316,
  etlDurationSeconds: 7.8,
  sqlServerIndexedViewSpeedup: '120x'
};

export const TLD_DISTRIBUTION = [
  { tld: '.com', total: 135400, phishing: 58200, legit: 77200, rate: 43.0 },
  { tld: '.org', total: 24120, phishing: 3100, legit: 21020, rate: 12.9 },
  { tld: '.net', total: 15300, phishing: 7200, legit: 8100, rate: 47.1 },
  { tld: '.app', total: 9200, phishing: 8100, legit: 1100, rate: 88.0 },
  { tld: '.uk', total: 7100, phishing: 1200, legit: 5900, rate: 16.9 },
  { tld: '.co', total: 5400, phishing: 3100, legit: 2300, rate: 57.4 },
  { tld: '.xyz', total: 4900, phishing: 4400, legit: 500, rate: 89.8 },
  { tld: '.top', total: 3800, phishing: 3500, legit: 300, rate: 92.1 }
];

export const CORE_FACTS_COMPARISON = {
  fact1_similarity: {
    title: 'URLSimilarityIndex (Fact 1)',
    description: 'Chỉ số tương đồng cấu trúc URL (Thang điểm 0 - 100)',
    legitAvg: 100.0,
    phishingAvg: 49.13,
    variance: -50.87
  },
  fact2_externalRef: {
    title: 'NoOfExternalRef (Fact 2)',
    description: 'Số lượng liên kết trỏ ra website bên ngoài (Backlinks)',
    legitAvg: 85.29,
    phishingAvg: 1.13,
    variance: -84.16
  }
};

export const MODEL_BENCHMARK = [
  { name: 'Logistic Regression', accuracy: 99.98, precision: 99.97, recall: 100.0, f1: 99.99, trainTime: '0.84s', type: 'Linear Baseline' },
  { name: 'Decision Tree (CART)', accuracy: 99.98, precision: 99.97, recall: 99.99, f1: 99.98, trainTime: '0.25s', type: 'Interpretable Tree' },
  { name: 'Random Forest (Ensemble)', accuracy: 99.99, precision: 99.97, recall: 100.0, f1: 99.99, trainTime: '1.35s', type: 'Proposed Champion', isBest: true }
];

export const FEATURE_IMPORTANCES = [
  { feature: 'URLSimilarityIndex (Fact 1)', weight: 36.90, category: 'Fact Measure', highlight: true, color: '#EF4444' },
  { feature: 'NoOfExternalRef (Fact 2)', weight: 22.46, category: 'Fact Measure', highlight: true, color: '#3B82F6' },
  { feature: 'IsHTTPS (Dim Security)', weight: 11.83, category: 'Security Dimension', highlight: true, color: '#10B981' },
  { feature: 'NoOfOtherSpecialCharsInURL', weight: 8.71, category: 'URL Syntax' },
  { feature: 'DegitRatioInURL', weight: 4.64, category: 'Lexical' },
  { feature: 'NoOfDegitsInURL', weight: 3.86, category: 'Lexical' },
  { feature: 'SpacialCharRatioInURL', weight: 3.12, category: 'Lexical' },
  { feature: 'URLLength', weight: 2.54, category: 'Lexical' },
  { feature: 'LetterRatioInURL', weight: 1.87, category: 'Lexical' },
  { feature: 'NoOfLettersInURL', weight: 1.43, category: 'Lexical' }
];

export const STAR_SCHEMA_TABLES = [
  {
    name: 'Fact_Phishing_Detail',
    type: 'FACT 1: CHI TIẾT (ATOMIC)',
    grain: 'Mỗi dòng là 1 URL kiểm tra thực tế (Mức nguyên tử)',
    rows: '235,795 rows',
    pk: 'FactID (BIGINT IDENTITY)',
    fk: ['DomainKey -> Dim_Domain', 'SecurityKey -> Dim_Security_Feature', 'WebContentKey -> Dim_Web_Content', 'FinancialKey -> Dim_Financial_Keyword', 'LabelKey -> Dim_Label'],
    measures: ['URLSimilarityIndex (Fact 1)', 'NoOfExternalRef (Fact 2)', 'URLCount = 1'],
    description: 'Bảng Fact chi tiết lưu vết toàn diện từng URL, kết nối với ĐỦ 5 BẢNG CHIỀU qua Surrogate Keys, hỗ trợ đào sâu (Drill-down) từng bản ghi.'
  },
  {
    name: 'Agg_Fact_Phishing_Summary',
    type: 'FACT 2: TỔNG HỢP (AGGREGATE)',
    grain: 'Mức tổng hợp theo TLD + Cấp độ an ninh + Nhãn',
    rows: 'Pre-computed summary',
    pk: 'AggID (INT IDENTITY)',
    fk: ['SecurityKey -> Dim_Security_Feature', 'LabelKey -> Dim_Label'],
    measures: ['TotalURLs', 'Avg_URLSimilarityIndex', 'Avg_NoOfExternalRef', 'Total_ExternalRef'],
    description: 'Bảng Fact tổng hợp sẵn (Summary Table) giúp các truy vấn cuộn gộp (Roll-up) chạy dưới 2ms, tối ưu tốc độ báo cáo OLAP mà không cần quét lại kho lớn.'
  },
  {
    name: 'Dim_Domain',
    type: 'DIMENSION',
    grain: 'Thông tin kỹ thuật về tên miền',
    pk: 'DomainKey (INT)',
    attributes: ['Domain', 'TLD', 'TLDLength', 'NoOfSubDomain', 'IsDomainIP'],
    description: 'Chiều phân tích cấu trúc tên miền, xác định IP và đuôi TLD.'
  },
  {
    name: 'Dim_Security_Feature',
    type: 'DIMENSION',
    grain: 'Đặc trưng bảo mật và kỹ thuật che giấu',
    pk: 'SecurityKey (INT)',
    attributes: ['IsHTTPS', 'HasObfuscation', 'HasPasswordField', 'HasExternalFormSubmit', 'SecurityProfile'],
    description: 'Chiều phân tích an ninh: chứng chỉ HTTPS và hành vi bẫy mật khẩu.'
  },
  {
    name: 'Dim_Label',
    type: 'DIMENSION',
    grain: 'Phân loại rủi ro và nhãn kiểm thử',
    pk: 'LabelKey (TINYINT: 0/1)',
    attributes: ['LabelName (Phishing / Legitimate)', 'RiskLevel (Critical / Safe)'],
    description: 'Chiều nhãn phân lớp phục vụ giám sát và huấn luyện AI.'
  },
  {
    name: 'Dim_Financial_Keyword',
    type: 'DIMENSION',
    grain: 'Dấu hiệu nhắm vào các mục tiêu tài chính',
    pk: 'FinancialKey (INT)',
    attributes: ['Bank', 'Pay', 'Crypto', 'FinancialCategory'],
    description: 'Chiều phát hiện website nhái ngân hàng, cổng thanh toán hoặc tiền ảo.'
  },
  {
    name: 'Dim_Web_Content',
    type: 'DIMENSION',
    grain: 'Cấu trúc mã nguồn HTML',
    pk: 'WebContentKey (INT)',
    attributes: ['HasTitle', 'HasFavicon', 'Robots', 'IsResponsive', 'HasSocialNet'],
    description: 'Chiều phân tích tính toàn vẹn của mã nguồn trang web.'
  }
];
