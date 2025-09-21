// 数据验证和质量保证服务
// 确保搜索框查询的数据真实性、准确性和完整性

// 验证规则配置
const VALIDATION_RULES = {
  // 必需字段验证
  REQUIRED_FIELDS: [
    'code',
    'englishName', 
    'category',
    'anzscoCode'
  ],
  
  // 推荐字段验证
  PREFERRED_FIELDS: [
    'chineseName',
    'description',
    'requirements',
    'assessmentAuthority',
    'visaSubclasses',
    'skillLevel'
  ],
  
  // 字段格式验证
  FIELD_FORMATS: {
    anzscoCode: /^\d{6}$/,
    code: /^\d{6}$/,
    englishName: /^[A-Za-z\s\(\)\-\/&,\.]{2,100}$/,
    category: /^[A-Za-z\s]{2,50}$/,
    skillLevel: /^[1-5]$/,
    visaSubclasses: /^(189|190|191|491|482|485|494|858|864)$/
  },
  
  // 数据范围验证
  VALUE_RANGES: {
    skillLevel: { min: 1, max: 5 },
    minPoints: { min: 0, max: 200 },
    invitationCount: { min: 0, max: 10000 }
  },
  
  // 业务逻辑验证
  BUSINESS_RULES: {
    // 职业列表互斥性
    listExclusivity: true,
    // ANZSCO代码唯一性
    anzscoUniqueness: true,
    // 签证类别有效性
    visaValidity: true
  }
};

// 数据质量评分权重
const QUALITY_WEIGHTS = {
  COMPLETENESS: 0.3,      // 完整性
  ACCURACY: 0.25,         // 准确性
  CONSISTENCY: 0.2,       // 一致性
  FRESHNESS: 0.15,        // 新鲜度
  RELIABILITY: 0.1        // 可靠性
};

// 数据源可信度评级
const SOURCE_RELIABILITY = {
  'AUSTRALIA_IMMIGRATION': 100,
  'AUSTRALIAN_BUREAU_STATISTICS': 95,
  'DATA_GOV_AU': 90,
  'ASSESSMENT_AUTHORITIES': 85,
  'THIRD_PARTY_SOURCES': 75,
  'LOCAL_BACKUP': 60,
  'UNKNOWN': 30
};

class DataValidator {
  constructor() {
    this.validationHistory = new Map();
    this.qualityMetrics = new Map();
    this.anomalyDetector = new AnomalyDetector();
    this.crossValidator = new CrossValidator();
  }

  /**
   * 验证单个数据项
   */
  validateDataItem(item, context = {}) {
    const validation = {
      isValid: true,
      score: 0,
      errors: [],
      warnings: [],
      suggestions: [],
      metrics: {
        completeness: 0,
        accuracy: 0,
        consistency: 0,
        freshness: 0,
        reliability: 0
      }
    };

    try {
      // 1. 必需字段验证
      this.validateRequiredFields(item, validation);
      
      // 2. 字段格式验证
      this.validateFieldFormats(item, validation);
      
      // 3. 数据范围验证
      this.validateValueRanges(item, validation);
      
      // 4. 业务逻辑验证
      this.validateBusinessRules(item, validation, context);
      
      // 5. 计算质量指标
      this.calculateQualityMetrics(item, validation, context);
      
      // 6. 计算总体评分
      validation.score = this.calculateOverallScore(validation.metrics);
      
      // 7. 生成改进建议
      this.generateSuggestions(item, validation);
      
    } catch (error) {
      validation.isValid = false;
      validation.errors.push({
        type: 'VALIDATION_ERROR',
        message: `验证过程出错: ${error.message}`,
        severity: 'HIGH'
      });
    }

    return validation;
  }

  /**
   * 批量验证数据集
   */
  async validateDataset(dataset, options = {}) {
    const {
      enableParallelValidation = true,
      maxConcurrency = 10,
      enableCrossValidation = true,
      enableAnomalyDetection = true
    } = options;

    console.log(`🔍 开始验证数据集，共 ${dataset.length} 条记录...`);
    
    const startTime = Date.now();
    const results = {
      summary: {
        total: dataset.length,
        valid: 0,
        invalid: 0,
        warnings: 0,
        averageScore: 0,
        validationTime: 0
      },
      details: [],
      anomalies: [],
      crossValidationResults: null,
      qualityReport: null
    };

    try {
      // 并行验证处理
      let validationPromises;
      
      if (enableParallelValidation) {
        validationPromises = this.createParallelValidationTasks(dataset, maxConcurrency);
      } else {
        validationPromises = dataset.map(item => Promise.resolve(this.validateDataItem(item)));
      }

      const validationResults = await Promise.all(validationPromises);
      
      // 处理验证结果
      validationResults.forEach((validation, index) => {
        const item = dataset[index];
        
        results.details.push({
          item: item,
          validation: validation,
          index: index
        });
        
        if (validation.isValid) {
          results.summary.valid++;
        } else {
          results.summary.invalid++;
        }
        
        if (validation.warnings.length > 0) {
          results.summary.warnings++;
        }
      });

      // 计算平均分数
      const totalScore = validationResults.reduce((sum, v) => sum + v.score, 0);
      results.summary.averageScore = Math.round(totalScore / validationResults.length);
      
      // 异常检测
      if (enableAnomalyDetection) {
        console.log('🔍 执行异常检测...');
        results.anomalies = await this.anomalyDetector.detectAnomalies(dataset, validationResults);
      }
      
      // 交叉验证
      if (enableCrossValidation) {
        console.log('🔍 执行交叉验证...');
        results.crossValidationResults = await this.crossValidator.performCrossValidation(dataset);
      }
      
      // 生成质量报告
      results.qualityReport = this.generateQualityReport(validationResults, results.anomalies);
      
      results.summary.validationTime = Date.now() - startTime;
      
      console.log(`✅ 数据验证完成，耗时 ${results.summary.validationTime}ms`);
      console.log(`📊 验证结果: 有效 ${results.summary.valid}，无效 ${results.summary.invalid}，平均分数 ${results.summary.averageScore}`);
      
      return results;
      
    } catch (error) {
      console.error('❌ 数据验证失败:', error);
      throw error;
    }
  }

  /**
   * 验证必需字段
   */
  validateRequiredFields(item, validation) {
    const missingFields = [];
    
    VALIDATION_RULES.REQUIRED_FIELDS.forEach(field => {
      if (!item[field] || (typeof item[field] === 'string' && item[field].trim() === '')) {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      validation.isValid = false;
      validation.errors.push({
        type: 'MISSING_REQUIRED_FIELDS',
        message: `缺少必需字段: ${missingFields.join(', ')}`,
        fields: missingFields,
        severity: 'HIGH'
      });
    }
    
    // 计算完整性分数
    const completenessScore = ((VALIDATION_RULES.REQUIRED_FIELDS.length - missingFields.length) / 
                              VALIDATION_RULES.REQUIRED_FIELDS.length) * 100;
    validation.metrics.completeness = Math.max(0, completenessScore);
  }

  /**
   * 验证字段格式
   */
  validateFieldFormats(item, validation) {
    const formatErrors = [];
    
    Object.entries(VALIDATION_RULES.FIELD_FORMATS).forEach(([field, pattern]) => {
      if (item[field] && !pattern.test(item[field])) {
        formatErrors.push({
          field,
          value: item[field],
          expectedPattern: pattern.toString()
        });
      }
    });
    
    if (formatErrors.length > 0) {
      validation.errors.push({
        type: 'INVALID_FORMAT',
        message: '字段格式不正确',
        details: formatErrors,
        severity: 'MEDIUM'
      });
    }
    
    // 验证签证子类别数组
    if (item.visaSubclasses && Array.isArray(item.visaSubclasses)) {
      const invalidVisas = item.visaSubclasses.filter(visa => 
        !VALIDATION_RULES.FIELD_FORMATS.visaSubclasses.test(visa)
      );
      
      if (invalidVisas.length > 0) {
        validation.errors.push({
          type: 'INVALID_VISA_SUBCLASSES',
          message: `无效的签证子类别: ${invalidVisas.join(', ')}`,
          invalidValues: invalidVisas,
          severity: 'MEDIUM'
        });
      }
    }
    
    // 计算准确性分数
    const totalFormatChecks = Object.keys(VALIDATION_RULES.FIELD_FORMATS).length;
    const accuracyScore = ((totalFormatChecks - formatErrors.length) / totalFormatChecks) * 100;
    validation.metrics.accuracy = Math.max(0, accuracyScore);
  }

  /**
   * 验证数值范围
   */
  validateValueRanges(item, validation) {
    const rangeErrors = [];
    
    Object.entries(VALIDATION_RULES.VALUE_RANGES).forEach(([field, range]) => {
      if (item[field] !== undefined && item[field] !== null) {
        const value = parseInt(item[field]);
        
        if (isNaN(value) || value < range.min || value > range.max) {
          rangeErrors.push({
            field,
            value: item[field],
            expectedRange: `${range.min}-${range.max}`
          });
        }
      }
    });
    
    if (rangeErrors.length > 0) {
      validation.errors.push({
        type: 'VALUE_OUT_OF_RANGE',
        message: '字段值超出有效范围',
        details: rangeErrors,
        severity: 'MEDIUM'
      });
    }
  }

  /**
   * 验证业务逻辑规则
   */
  validateBusinessRules(item, validation, context) {
    // 1. 验证职业列表互斥性
    if (VALIDATION_RULES.BUSINESS_RULES.listExclusivity) {
      const listCount = [item.mltssl, item.stsol, item.rol].filter(Boolean).length;
      
      if (listCount === 0) {
        validation.warnings.push({
          type: 'NO_OCCUPATION_LIST',
          message: '职业未在任何官方列表中',
          severity: 'LOW'
        });
      } else if (listCount > 1) {
        validation.warnings.push({
          type: 'MULTIPLE_OCCUPATION_LISTS',
          message: '职业同时在多个列表中，请确认准确性',
          severity: 'MEDIUM'
        });
      }
    }
    
    // 2. 验证技能等级与职业类别的匹配性
    if (item.skillLevel && item.category) {
      const expectedSkillLevel = this.getExpectedSkillLevel(item.category);
      
      if (expectedSkillLevel && Math.abs(item.skillLevel - expectedSkillLevel) > 1) {
        validation.warnings.push({
          type: 'SKILL_LEVEL_MISMATCH',
          message: `技能等级 ${item.skillLevel} 与职业类别 ${item.category} 不匹配，预期等级: ${expectedSkillLevel}`,
          severity: 'LOW'
        });
      }
    }
    
    // 3. 验证评估机构与职业类别的匹配性
    if (item.assessmentAuthority && item.category) {
      const expectedAuthority = this.getExpectedAssessmentAuthority(item.category);
      
      if (expectedAuthority && item.assessmentAuthority !== expectedAuthority) {
        validation.warnings.push({
          type: 'ASSESSMENT_AUTHORITY_MISMATCH',
          message: `评估机构 ${item.assessmentAuthority} 与职业类别 ${item.category} 不匹配，预期机构: ${expectedAuthority}`,
          severity: 'LOW'
        });
      }
    }
    
    // 计算一致性分数
    const consistencyScore = 100 - (validation.warnings.length * 10);
    validation.metrics.consistency = Math.max(0, consistencyScore);
  }

  /**
   * 计算质量指标
   */
  calculateQualityMetrics(item, validation, context) {
    // 1. 新鲜度评估
    if (item.lastUpdated) {
      const lastUpdated = new Date(item.lastUpdated);
      const now = new Date();
      const ageInDays = (now - lastUpdated) / (1000 * 60 * 60 * 24);
      
      let freshnessScore = 100;
      if (ageInDays > 30) {
        freshnessScore = Math.max(0, 100 - ((ageInDays - 30) * 2));
      }
      
      validation.metrics.freshness = freshnessScore;
    } else {
      validation.metrics.freshness = 50; // 未知更新时间
    }
    
    // 2. 可靠性评估
    if (item.dataSources && item.dataSources.length > 0) {
      const sourceScores = item.dataSources.map(source => 
        SOURCE_RELIABILITY[source] || SOURCE_RELIABILITY.UNKNOWN
      );
      
      validation.metrics.reliability = Math.max(...sourceScores);
    } else {
      validation.metrics.reliability = SOURCE_RELIABILITY.UNKNOWN;
    }
  }

  /**
   * 计算总体评分
   */
  calculateOverallScore(metrics) {
    return Math.round(
      metrics.completeness * QUALITY_WEIGHTS.COMPLETENESS +
      metrics.accuracy * QUALITY_WEIGHTS.ACCURACY +
      metrics.consistency * QUALITY_WEIGHTS.CONSISTENCY +
      metrics.freshness * QUALITY_WEIGHTS.FRESHNESS +
      metrics.reliability * QUALITY_WEIGHTS.RELIABILITY
    );
  }

  /**
   * 生成改进建议
   */
  generateSuggestions(item, validation) {
    // 基于验证结果生成具体的改进建议
    if (validation.metrics.completeness < 80) {
      validation.suggestions.push({
        type: 'IMPROVE_COMPLETENESS',
        message: '建议补充缺失的字段信息，特别是描述和要求',
        priority: 'HIGH'
      });
    }
    
    if (validation.metrics.accuracy < 90) {
      validation.suggestions.push({
        type: 'IMPROVE_ACCURACY',
        message: '建议检查字段格式和数值范围',
        priority: 'HIGH'
      });
    }
    
    if (validation.metrics.freshness < 70) {
      validation.suggestions.push({
        type: 'UPDATE_DATA',
        message: '数据较旧，建议更新至最新版本',
        priority: 'MEDIUM'
      });
    }
    
    if (validation.warnings.length > 2) {
      validation.suggestions.push({
        type: 'RESOLVE_WARNINGS',
        message: '建议解决数据一致性警告',
        priority: 'MEDIUM'
      });
    }
  }

  /**
   * 创建并行验证任务
   */
  createParallelValidationTasks(dataset, maxConcurrency) {
    const tasks = [];
    
    for (let i = 0; i < dataset.length; i += maxConcurrency) {
      const batch = dataset.slice(i, i + maxConcurrency);
      
      const batchTask = batch.map(item => 
        new Promise(resolve => {
          // 使用 setTimeout 确保异步执行
          setTimeout(() => {
            resolve(this.validateDataItem(item));
          }, 0);
        })
      );
      
      tasks.push(...batchTask);
    }
    
    return tasks;
  }

  /**
   * 生成质量报告
   */
  generateQualityReport(validationResults, anomalies) {
    const report = {
      overview: {
        totalItems: validationResults.length,
        averageScore: 0,
        scoreDistribution: {
          excellent: 0,    // 90-100
          good: 0,         // 70-89
          fair: 0,         // 50-69
          poor: 0          // 0-49
        }
      },
      metrics: {
        completeness: { average: 0, min: 100, max: 0 },
        accuracy: { average: 0, min: 100, max: 0 },
        consistency: { average: 0, min: 100, max: 0 },
        freshness: { average: 0, min: 100, max: 0 },
        reliability: { average: 0, min: 100, max: 0 }
      },
      commonIssues: [],
      recommendations: [],
      anomalySummary: {
        total: anomalies.length,
        byType: {}
      }
    };

    // 计算统计信息
    const scores = validationResults.map(v => v.score);
    report.overview.averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    // 分数分布
    scores.forEach(score => {
      if (score >= 90) report.overview.scoreDistribution.excellent++;
      else if (score >= 70) report.overview.scoreDistribution.good++;
      else if (score >= 50) report.overview.scoreDistribution.fair++;
      else report.overview.scoreDistribution.poor++;
    });
    
    // 指标统计
    Object.keys(report.metrics).forEach(metric => {
      const values = validationResults.map(v => v.metrics[metric]);
      report.metrics[metric].average = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
      report.metrics[metric].min = Math.min(...values);
      report.metrics[metric].max = Math.max(...values);
    });
    
    // 常见问题统计
    const issueCount = new Map();
    validationResults.forEach(v => {
      v.errors.forEach(error => {
        const count = issueCount.get(error.type) || 0;
        issueCount.set(error.type, count + 1);
      });
    });
    
    report.commonIssues = Array.from(issueCount.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // 异常统计
    anomalies.forEach(anomaly => {
      const count = report.anomalySummary.byType[anomaly.type] || 0;
      report.anomalySummary.byType[anomaly.type] = count + 1;
    });
    
    // 生成建议
    if (report.overview.averageScore < 80) {
      report.recommendations.push({
        type: 'OVERALL_QUALITY',
        message: '整体数据质量需要改进，建议重点关注数据完整性和准确性',
        priority: 'HIGH'
      });
    }
    
    if (report.metrics.freshness.average < 70) {
      report.recommendations.push({
        type: 'DATA_FRESHNESS',
        message: '数据新鲜度较低，建议建立定期更新机制',
        priority: 'MEDIUM'
      });
    }
    
    return report;
  }

  /**
   * 获取预期技能等级
   */
  getExpectedSkillLevel(category) {
    const skillLevelMap = {
      'Management': 1,
      'ICT': 1,
      'Engineering': 1,
      'Healthcare': 1,
      'Finance': 1,
      'Education': 1,
      'Social Work': 1
    };
    
    return skillLevelMap[category] || null;
  }

  /**
   * 获取预期评估机构
   */
  getExpectedAssessmentAuthority(category) {
    const authorityMap = {
      'ICT': 'ACS',
      'Engineering': 'Engineers Australia',
      'Healthcare': 'ANMAC',
      'Management': 'VETASSESS',
      'Finance': 'CPA Australia',
      'Education': 'AITSL',
      'Social Work': 'AASW'
    };
    
    return authorityMap[category] || null;
  }

  /**
   * 实时数据质量监控
   */
  startQualityMonitoring(interval = 60000) {
    console.log('📊 启动数据质量监控...');
    
    setInterval(async () => {
      try {
        // 获取最新数据样本进行质量检查
        const sampleData = await this.getSampleData();
        
        if (sampleData && sampleData.length > 0) {
          const quickValidation = await this.performQuickValidation(sampleData);
          
          // 质量下降告警
          if (quickValidation.averageScore < 70) {
            console.warn('⚠️ 数据质量下降警告:', quickValidation);
            
            // 可以在这里触发告警通知
            uni.showToast({
              title: 'Data quality degraded',
              icon: 'none'
            });
          }
        }
      } catch (error) {
        console.error('❌ 质量监控失败:', error);
      }
    }, interval);
  }

  /**
   * 获取数据样本
   */
  async getSampleData(sampleSize = 10) {
    try {
      const cachedData = uni.getStorageSync('enhanced_cache_commercial_data');
      
      if (cachedData && cachedData.data && cachedData.data.data) {
        const allData = cachedData.data.data;
        
        // 随机抽样
        const sample = [];
        for (let i = 0; i < Math.min(sampleSize, allData.length); i++) {
          const randomIndex = Math.floor(Math.random() * allData.length);
          sample.push(allData[randomIndex]);
        }
        
        return sample;
      }
    } catch (error) {
      console.error('获取数据样本失败:', error);
    }
    
    return [];
  }

  /**
   * 执行快速验证
   */
  async performQuickValidation(sampleData) {
    const validationResults = sampleData.map(item => this.validateDataItem(item));
    
    const averageScore = validationResults.reduce((sum, v) => sum + v.score, 0) / validationResults.length;
    const errorCount = validationResults.reduce((sum, v) => sum + v.errors.length, 0);
    const warningCount = validationResults.reduce((sum, v) => sum + v.warnings.length, 0);
    
    return {
      sampleSize: sampleData.length,
      averageScore: Math.round(averageScore),
      errorCount,
      warningCount,
      timestamp: new Date().toISOString()
    };
  }
}

// 异常检测器
class AnomalyDetector {
  constructor() {
    this.thresholds = {
      scoreDeviation: 2,      // 标准差倍数
      duplicateRatio: 0.1,    // 重复数据比例阈值
      missingFieldRatio: 0.3  // 缺失字段比例阈值
    };
  }

  /**
   * 检测数据异常
   */
  async detectAnomalies(dataset, validationResults) {
    const anomalies = [];
    
    // 1. 检测质量分数异常
    const scoreAnomalies = this.detectScoreAnomalies(validationResults);
    anomalies.push(...scoreAnomalies);
    
    // 2. 检测重复数据
    const duplicateAnomalies = this.detectDuplicates(dataset);
    anomalies.push(...duplicateAnomalies);
    
    // 3. 检测缺失字段模式
    const missingFieldAnomalies = this.detectMissingFieldPatterns(dataset);
    anomalies.push(...missingFieldAnomalies);
    
    // 4. 检测数值异常
    const valueAnomalies = this.detectValueAnomalies(dataset);
    anomalies.push(...valueAnomalies);
    
    return anomalies;
  }

  /**
   * 检测分数异常
   */
  detectScoreAnomalies(validationResults) {
    const scores = validationResults.map(v => v.score);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    
    const anomalies = [];
    
    validationResults.forEach((result, index) => {
      const deviation = Math.abs(result.score - mean) / stdDev;
      
      if (deviation > this.thresholds.scoreDeviation) {
        anomalies.push({
          type: 'SCORE_ANOMALY',
          index,
          score: result.score,
          mean,
          deviation: deviation.toFixed(2),
          severity: deviation > 3 ? 'HIGH' : 'MEDIUM'
        });
      }
    });
    
    return anomalies;
  }

  /**
   * 检测重复数据
   */
  detectDuplicates(dataset) {
    const duplicates = new Map();
    const anomalies = [];
    
    dataset.forEach((item, index) => {
      const key = `${item.anzscoCode}_${item.englishName}`;
      
      if (duplicates.has(key)) {
        duplicates.get(key).push(index);
      } else {
        duplicates.set(key, [index]);
      }
    });
    
    duplicates.forEach((indices, key) => {
      if (indices.length > 1) {
        anomalies.push({
          type: 'DUPLICATE_DATA',
          key,
          indices,
          count: indices.length,
          severity: 'MEDIUM'
        });
      }
    });
    
    return anomalies;
  }

  /**
   * 检测缺失字段模式
   */
  detectMissingFieldPatterns(dataset) {
    const fieldMissingCount = new Map();
    const anomalies = [];
    
    // 统计每个字段的缺失次数
    dataset.forEach(item => {
      VALIDATION_RULES.PREFERRED_FIELDS.forEach(field => {
        if (!item[field] || (typeof item[field] === 'string' && item[field].trim() === '')) {
          const count = fieldMissingCount.get(field) || 0;
          fieldMissingCount.set(field, count + 1);
        }
      });
    });
    
    // 检测异常缺失模式
    fieldMissingCount.forEach((count, field) => {
      const missingRatio = count / dataset.length;
      
      if (missingRatio > this.thresholds.missingFieldRatio) {
        anomalies.push({
          type: 'HIGH_MISSING_FIELD_RATIO',
          field,
          missingCount: count,
          totalCount: dataset.length,
          missingRatio: missingRatio.toFixed(3),
          severity: missingRatio > 0.7 ? 'HIGH' : 'MEDIUM'
        });
      }
    });
    
    return anomalies;
  }

  /**
   * 检测数值异常
   */
  detectValueAnomalies(dataset) {
    const anomalies = [];
    
    // 检测邀请分数异常
    const invitationPoints = dataset
      .filter(item => item.invitationData && item.invitationData.minPoints)
      .map(item => item.invitationData.minPoints);
    
    if (invitationPoints.length > 0) {
      const pointsAnomalies = this.detectNumericalOutliers(invitationPoints, 'INVITATION_POINTS');
      anomalies.push(...pointsAnomalies);
    }
    
    // 检测邀请数量异常
    const invitationCounts = dataset
      .filter(item => item.invitationData && item.invitationData.invitationCount)
      .map(item => item.invitationData.invitationCount);
    
    if (invitationCounts.length > 0) {
      const countAnomalies = this.detectNumericalOutliers(invitationCounts, 'INVITATION_COUNT');
      anomalies.push(...countAnomalies);
    }
    
    return anomalies;
  }

  /**
   * 检测数值离群点
   */
  detectNumericalOutliers(values, type) {
    const anomalies = [];
    
    if (values.length < 4) return anomalies;
    
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    values.forEach((value, index) => {
      if (value < lowerBound || value > upperBound) {
        anomalies.push({
          type: `${type}_OUTLIER`,
          index,
          value,
          lowerBound,
          upperBound,
          severity: 'LOW'
        });
      }
    });
    
    return anomalies;
  }
}

// 交叉验证器
class CrossValidator {
  constructor() {
    this.externalSources = new Map();
  }

  /**
   * 执行交叉验证
   */
  async performCrossValidation(dataset) {
    const results = {
      anzscoCodeValidation: await this.validateANZSCOCodes(dataset),
      categoryConsistency: await this.validateCategoryConsistency(dataset),
      assessmentAuthorityValidation: await this.validateAssessmentAuthorities(dataset)
    };
    
    return results;
  }

  /**
   * 验证ANZSCO代码有效性
   */
  async validateANZSCOCodes(dataset) {
    // 这里可以与外部ANZSCO数据库进行交叉验证
    // 目前使用内置的验证逻辑
    
    const validCodes = new Set();
    const invalidCodes = [];
    
    dataset.forEach(item => {
      if (item.anzscoCode && /^\d{6}$/.test(item.anzscoCode)) {
        validCodes.add(item.anzscoCode);
      } else {
        invalidCodes.push({
          code: item.anzscoCode,
          englishName: item.englishName
        });
      }
    });
    
    return {
      totalCodes: dataset.length,
      validCodes: validCodes.size,
      invalidCodes: invalidCodes.length,
      validationRate: (validCodes.size / dataset.length * 100).toFixed(2) + '%',
      invalidItems: invalidCodes.slice(0, 10) // 只返回前10个无效项
    };
  }

  /**
   * 验证类别一致性
   */
  async validateCategoryConsistency(dataset) {
    const categoryGroups = new Map();
    
    // 按ANZSCO代码前两位分组
    dataset.forEach(item => {
      if (item.anzscoCode && item.category) {
        const prefix = item.anzscoCode.substring(0, 2);
        
        if (!categoryGroups.has(prefix)) {
          categoryGroups.set(prefix, new Set());
        }
        
        categoryGroups.get(prefix).add(item.category);
      }
    });
    
    const inconsistencies = [];
    
    categoryGroups.forEach((categories, prefix) => {
      if (categories.size > 1) {
        inconsistencies.push({
          anzscoPrefix: prefix,
          categories: Array.from(categories),
          count: categories.size
        });
      }
    });
    
    return {
      totalGroups: categoryGroups.size,
      consistentGroups: categoryGroups.size - inconsistencies.length,
      inconsistentGroups: inconsistencies.length,
      inconsistencies: inconsistencies.slice(0, 5)
    };
  }

  /**
   * 验证评估机构
   */
  async validateAssessmentAuthorities(dataset) {
    const authorityMapping = new Map();
    
    dataset.forEach(item => {
      if (item.category && item.assessmentAuthority) {
        if (!authorityMapping.has(item.category)) {
          authorityMapping.set(item.category, new Set());
        }
        
        authorityMapping.get(item.category).add(item.assessmentAuthority);
      }
    });
    
    const multipleAuthorities = [];
    
    authorityMapping.forEach((authorities, category) => {
      if (authorities.size > 1) {
        multipleAuthorities.push({
          category,
          authorities: Array.from(authorities),
          count: authorities.size
        });
      }
    });
    
    return {
      totalCategories: authorityMapping.size,
      categoriesWithMultipleAuthorities: multipleAuthorities.length,
      multipleAuthorities
    };
  }
}

// 创建数据验证器实例
const dataValidator = new DataValidator();

export default dataValidator;

// 导出主要方法
export const {
  validateDataItem,
  validateDataset,
  startQualityMonitoring
} = dataValidator;
