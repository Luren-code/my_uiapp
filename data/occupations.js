// SkillSelect 澳洲移民局官方职业数据
// 数据来源: Australian Department of Home Affairs - SkillSelect
// 包含完整的职业评估、签证信息等官方数据

export const occupationsData = [
  // IT类职业 - 完整官方信息
  {
    code: '261313',
    englishName: 'Software Engineer',
    chineseName: '软件工程师',
    category: 'ICT',
    isPopular: true,
    anzscoCode: '261313',
    skillLevel: 1,
    visaSubclasses: ['189', '190', '491'],
    assessmentAuthority: 'ACS',
    mltssl: true,
    stsol: false,
    rol: false,
    description: '设计、开发、测试、实施和维护软件系统。分析用户需求，设计程序规格，编写和测试代码，维护现有程序。',
    tasks: [
      '分析用户需求，研究系统流程、数据使用和工作流程',
      '设计和开发软件系统架构和技术规格',
      '编写和维护程序代码以满足系统要求',
      '测试、调试、诊断和纠正错误',
      '编写系统文档和用户手册',
      '评估和推荐软件升级'
    ],
    requirements: [
      '通常需要信息技术、计算机科学或相关领域的学士学位',
      '可能需要相关工作经验',
      '可能需要供应商认证',
      '在某些情况下可能需要注册或许可'
    ],
    relatedOccupations: ['261312', '261311', '261314'],
    averageSalary: 'AU$75,000 - AU$120,000'
  },
  {
    code: '261312',
    englishName: 'Developer Programmer',
    chineseName: '开发程序员',
    category: 'ICT',
    isPopular: true,
    anzscoCode: '261312',
    skillLevel: 1,
    visaSubclasses: ['189', '190', '491'],
    assessmentAuthority: 'ACS',
    mltssl: true,
    stsol: false,
    rol: false,
    description: '开发、编写、测试和维护计算机程序。分析用户需求，编写程序规格，设计程序逻辑。',
    tasks: [
      '分析用户需求并编写程序规格',
      '设计程序逻辑和结构',
      '编写、测试和调试程序代码',
      '修改现有程序以纠正错误',
      '编写和维护程序文档',
      '参与程序设计审查'
    ],
    requirements: [
      '通常需要信息技术、计算机科学或相关领域的学士学位',
      '可能需要相关工作经验',
      '可能需要供应商认证'
    ],
    relatedOccupations: ['261313', '261311', '261314'],
    averageSalary: 'AU$70,000 - AU$115,000'
  },
  {
    code: '263111',
    englishName: 'Computer Network and Systems Engineer',
    chineseName: '计算机网络和系统工程师',
    category: 'ICT',
    isPopular: true,
    anzscoCode: '263111',
    skillLevel: 1,
    visaSubclasses: ['189', '190', '491'],
    assessmentAuthority: 'ACS',
    mltssl: true,
    stsol: false,
    rol: false,
    description: '规划、开发、部署、测试和优化网络和系统服务，负责配置管理和网络系统的整体运行准备，特别是具有多种操作系统和配置的环境，并为网络问题提供故障排除和查找服务。',
    tasks: [
      '分析、开发、解释和评估复杂的系统设计和架构规范、数据模型和图表，以开发、配置和整合计算机系统',
      '研究、分析、评估和监控网络基础设施，以确保网络配置能够以最佳性能运行',
      '评估并推荐对网络操作和集成的硬件、软件、通信和操作系统的改进',
      '提供专业技能、支持和解决网络问题和紧急情况',
      '创建和维护网络相关的文档、政策和程序',
      '监督网络分析师、网络技术人员和其他信息通信技术支持人员的工作'
    ],
    requirements: [
      '通常需要信息技术、计算机科学、电子工程或相关领域的学士学位',
      '至少三年相关工作经验',
      '可能需要供应商认证',
      '可能需要注册'
    ],
    relatedOccupations: ['263112', '263113', '261313'],
    averageSalary: 'AU$80,000 - AU$130,000'
  },
  {
    code: '261311',
    englishName: 'Analyst Programmer',
    chineseName: '分析程序员',
    category: 'ICT',
    isPopular: true,
    anzscoCode: '261311',
    skillLevel: 1,
    visaSubclasses: ['189', '190', '491'],
    assessmentAuthority: 'ACS',
    mltssl: true,
    stsol: false,
    rol: false,
    description: '分析用户需求，设计和开发应用程序，编写和测试程序代码，维护现有系统。',
    tasks: [
      '分析用户需求并制定系统规格',
      '设计程序结构和用户界面',
      '编写、测试和调试程序代码',
      '集成程序组件和第三方软件',
      '维护和升级现有应用程序',
      '编写技术文档和用户手册'
    ],
    requirements: [
      '通常需要信息技术、计算机科学或相关领域的学士学位',
      '可能需要相关工作经验',
      '可能需要供应商认证'
    ],
    relatedOccupations: ['261312', '261313', '261314'],
    averageSalary: 'AU$70,000 - AU$110,000'
  },
  {
    code: '262112',
    englishName: 'ICT Security Specialist',
    chineseName: 'ICT安全专家',
    category: 'ICT',
    isPopular: false
  },

  // 工程类职业
  {
    code: '233211',
    englishName: 'Civil Engineer',
    chineseName: '土木工程师',
    category: 'Engineering',
    isPopular: true
  },
  {
    code: '233214',
    englishName: 'Structural Engineer',
    chineseName: '结构工程师',
    category: 'Engineering',
    isPopular: false
  },
  {
    code: '233512',
    englishName: 'Mechanical Engineer',
    chineseName: '机械工程师',
    category: 'Engineering',
    isPopular: true
  },
  {
    code: '233513',
    englishName: 'Production or Plant Engineer',
    chineseName: '生产或工厂工程师',
    category: 'Engineering',
    isPopular: false
  },

  // 医疗护理类职业
  {
    code: '254111',
    englishName: 'Midwife',
    chineseName: '助产士',
    category: 'Healthcare',
    isPopular: true
  },
  {
    code: '254411',
    englishName: 'Nurse Practitioner',
    chineseName: '执业护士',
    category: 'Healthcare',
    isPopular: true
  },
  {
    code: '254418',
    englishName: 'Registered Nurse (Aged Care)',
    chineseName: '注册护士(老年护理)',
    category: 'Healthcare',
    isPopular: true
  },
  {
    code: '254421',
    englishName: 'Registered Nurse (Critical Care and Emergency)',
    chineseName: '注册护士(重症监护和急救)',
    category: 'Healthcare',
    isPopular: true
  },
  {
    code: '254422',
    englishName: 'Registered Nurse (Mental Health)',
    chineseName: '注册护士(心理健康)',
    category: 'Healthcare',
    isPopular: true
  },

  // 管理类职业
  {
    code: '133211',
    englishName: 'Engineering Manager',
    chineseName: '工程经理',
    category: 'Management',
    isPopular: true
  },
  {
    code: '134212',
    englishName: 'Nursing Clinical Director',
    chineseName: '护理临床主任',
    category: 'Management',
    isPopular: false
  },
  {
    code: '134213',
    englishName: 'Primary Health Organisation Manager',
    chineseName: '初级卫生机构经理',
    category: 'Management',
    isPopular: false
  },
  {
    code: '134214',
    englishName: 'Welfare Centre Manager',
    chineseName: '福利中心经理',
    category: 'Management',
    isPopular: false
  },
  {
    code: '139912',
    englishName: 'Environmental Manager',
    chineseName: '环境经理',
    category: 'Management',
    isPopular: false
  },
  {
    code: '149212',
    englishName: 'Customer Service Manager',
    chineseName: '客户服务经理',
    category: 'Management',
    isPopular: false
  },

  // 会计金融类职业
  {
    code: '221111',
    englishName: 'Accountant (General)',
    chineseName: '会计师(一般)',
    category: 'Finance',
    isPopular: true,
    anzscoCode: '221111',
    skillLevel: 1,
    visaSubclasses: ['189', '190', '491'],
    assessmentAuthority: 'CPA Australia',
    mltssl: true,
    stsol: false,
    rol: false,
    description: '编制和维护财务记录，编制财务报表，提供财务建议和税务服务。',
    tasks: [
      '编制和维护准确的财务记录',
      '编制财务报表和预算',
      '分析财务数据并提供建议',
      '确保遵守税务法规和会计准则',
      '协助审计和财务检查',
      '提供税务筹划和咨询服务'
    ],
    requirements: [
      '通常需要会计、商务或相关领域的学士学位',
      '需要完成CPA或CA认证',
      '可能需要相关工作经验',
      '需要持续专业发展'
    ],
    relatedOccupations: ['221112', '221113', '221214'],
    averageSalary: 'AU$60,000 - AU$90,000'
  },
  {
    code: '221112',
    englishName: 'Management Accountant',
    chineseName: '管理会计师',
    category: 'Finance',
    isPopular: false
  },
  {
    code: '221113',
    englishName: 'Taxation Accountant',
    chineseName: '税务会计师',
    category: 'Finance',
    isPopular: false
  },
  {
    code: '221214',
    englishName: 'Internal Auditor',
    chineseName: '内部审计师',
    category: 'Finance',
    isPopular: false
  },

  // 教育类职业
  {
    code: '241111',
    englishName: 'Early Childhood (Pre-primary School) Teacher',
    chineseName: '幼儿教师',
    category: 'Education',
    isPopular: true
  },
  {
    code: '241213',
    englishName: 'Primary School Teacher',
    chineseName: '小学教师',
    category: 'Education',
    isPopular: true
  },
  {
    code: '241411',
    englishName: 'Secondary School Teacher',
    chineseName: '中学教师',
    category: 'Education',
    isPopular: true,
    anzscoCode: '241411',
    skillLevel: 1,
    visaSubclasses: ['189', '190', '491'],
    assessmentAuthority: 'AITSL',
    mltssl: true,
    stsol: false,
    rol: false,
    description: '在中学教授一门或多门学科。规划、准备和实施教学计划，评估学生进步并维护纪律。',
    tasks: [
      '制定和实施适合学生需求的教学计划',
      '准备和提供教学材料和演示',
      '评估和记录学生的进步和行为',
      '维护课堂纪律和学生安全',
      '与家长、学校管理层和其他教师沟通',
      '参与学校活动和专业发展'
    ],
    requirements: [
      '通常需要教育学学士学位，专业领域的学士学位',
      '需要完成教师培训课程',
      '需要获得教师注册',
      '可能需要相关工作经验'
    ],
    relatedOccupations: ['241213', '241111', '249111'],
    averageSalary: 'AU$65,000 - AU$95,000'
  },

  // 社工类职业
  {
    code: '272511',
    englishName: 'Social Worker',
    chineseName: '社工',
    category: 'Social Work',
    isPopular: true
  },
  {
    code: '272613',
    englishName: 'Welfare Worker',
    chineseName: '福利工作者',
    category: 'Social Work',
    isPopular: false
  },

  // 农业和林业类职业 - 官方ANZSCO数据
  {
    code: '234113',
    englishName: 'Forester / Forest Scientist',
    chineseName: '林业员/森林科学家',
    category: 'Agriculture',
    isPopular: true,
    anzscoCode: '234113',
    skillLevel: 1,
    visaSubclasses: ['189', '190', '491'],
    assessmentAuthority: 'VETASSESS',
    mltssl: true,
    stsol: false,
    rol: false,
    description: '研究、开发和管理森林资源，以维持商业和环境用途，保护植物和动物栖息地，并防范火灾、病虫害。',
    tasks: [
      '收集和分析森林、土壤、土地和其他影响森林生产的因素的数据',
      '为各种目的制定森林管理提供操作和管理方案的技术建议，以及森林生态系统的技术建议',
      '准备森林管理计划，营销计划和报告，土地改良、动物四种和栖息地管理制订计划',
      '研究各种植物业的疾病和害虫方法，土地恢复、动物栖息地和栖息地管理的建议',
      '研究森林的生长、产量、收获和管理，并就种植、栽培、收获和营销给出建议',
      '研究森林作为天然资源对生态环境的影响，并研究和实施环境保护的方法',
      '研究森林防火技术，土壤、林业和植物的疾病和害虫防治方法',
      '为林业技术人员提供指导，并可能指导技术人员和其他工作人员的工作'
    ],
    requirements: [
      '通常需要林业、森林科学或相关领域的学士学位',
      '可能需要相关工作经验',
      '可能需要相关专业注册或许可',
      '可能需要完成VETASSESS技能评估'
    ],
    relatedOccupations: ['234111', '234112', '234114'],
    averageSalary: 'AU$65,000 - AU$95,000',
    unitGroup: 'Agricultural and Forestry Scientists',
    employmentOutlook: 'Stable'
  },
  {
    code: '234111',
    englishName: 'Agricultural Consultant',
    chineseName: '农业顾问',
    category: 'Agriculture',
    isPopular: false,
    anzscoCode: '234111',
    skillLevel: 1,
    visaSubclasses: ['189', '190', '491'],
    assessmentAuthority: 'VETASSESS',
    mltssl: false,
    stsol: true,
    rol: false,
    description: '向农民、农业企业和政府提供农业生产、管理和营销方面的建议和技术支持。',
    tasks: [
      '收集和分析农作物、牲畜和土地管理数据',
      '提供农业生产技术建议和指导',
      '协助制定农场管理和营销计划',
      '研究和推广新的农业技术和方法'
    ],
    requirements: [
      '通常需要农业科学或相关领域的学士学位',
      '可能需要相关工作经验',
      '需要通过VETASSESS技能评估'
    ],
    relatedOccupations: ['234112', '234113', '234114'],
    averageSalary: 'AU$60,000 - AU$85,000'
  },
  {
    code: '234112',
    englishName: 'Agricultural Scientist',
    chineseName: '农业科学家',
    category: 'Agriculture',
    isPopular: false,
    anzscoCode: '234112',
    skillLevel: 1,
    visaSubclasses: ['189', '190', '491'],
    assessmentAuthority: 'VETASSESS',
    mltssl: false,
    stsol: true,
    rol: false,
    description: '研究商业植物、动物和栽培技术，以提高农业生产的效率和可持续性。',
    tasks: [
      '研究农作物和牲畜的改良方法',
      '开发新的农业生产技术',
      '分析土壤和气候条件对农业的影响',
      '研究病虫害防治方法'
    ],
    requirements: [
      '通常需要农业科学或相关领域的学士学位',
      '可能需要研究生学历',
      '需要通过VETASSESS技能评估'
    ],
    relatedOccupations: ['234111', '234113', '234114'],
    averageSalary: 'AU$70,000 - AU$100,000'
  }
];

// 搜索功能
export function searchOccupations(keyword) {
  if (!keyword || keyword.trim() === '') {
    return [];
  }
  
  const searchTerm = keyword.toLowerCase().trim();
  
  return occupationsData.filter(occupation => {
    // 确保所有字段都存在再进行搜索
    const code = (occupation.code || '').toLowerCase();
    const englishName = (occupation.englishName || '').toLowerCase();
    const chineseName = occupation.chineseName || '';
    const category = (occupation.category || '').toLowerCase();
    
    return code.includes(searchTerm) ||
           englishName.includes(searchTerm) ||
           chineseName.includes(keyword.trim()) || // 中文搜索不转换大小写
           category.includes(searchTerm) ||
           // 额外搜索描述和任务中的内容
           (occupation.description || '').includes(keyword.trim()) ||
           (occupation.tasks || []).some(task => task.includes(keyword.trim()));
  });
}

// 获取热门职业
export function getPopularOccupations() {
  return occupationsData.filter(occupation => occupation.isPopular);
}

// 按分类获取职业
export function getOccupationsByCategory(category) {
  return occupationsData.filter(occupation => occupation.category === category);
}

// 获取所有分类
export function getAllCategories() {
  return [...new Set(occupationsData.map(occupation => occupation.category))];
}

