import React, { useState } from 'react';
import UploadZone from '../upload/UploadZone';
import LoadingState from '../states/LoadingState';
import ErrorState from '../states/ErrorState';
import EmptyState from '../states/EmptyState';
import ReportResults from '../report/ReportResults';
import { api } from '../../services/api';
import { SAMPLE_REPORTS } from '../../data/sampleReports';

export default function Dashboard({
  activeReport,
  setActiveReport,
  isAnalyzing,
  setIsAnalyzing,
  error,
  setError,
  showUploaderOnly,
  setShowUploaderOnly
}) {
  const handleProcessFile = async (file) => {
    setError(null);
    setIsAnalyzing(true);

    try {
      // Direct live call to FastAPI POST /api/reports/analyze
      const data = await api.analyzeReport(file);
      
      const analysis = data.analysis || data;
      const formattedReport = {
        id: `upload-${Date.now()}`,
        title: analysis.report_type || 'Laboratory Investigation',
        category: 'Clinical Diagnostics',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        overallStatus: analysis.overall_status || 'normal',
        patientContext: analysis.patient_context_note || `${(data.extraction_method || 'Extracted').toUpperCase()} • ${data.filename || file.name}`,
        summary: analysis.summary,
        keyFindings: analysis.key_findings || [],
        metrics: (analysis.metrics || []).map((m) => ({
          name: m.name,
          value: m.value,
          unit: m.unit || '',
          standardRange: m.standard_range || 'Not specified in report',
          status: m.status || 'normal',
          category: 'Biomarker',
          simpleExplanation: m.simple_explanation,
        })),
        questionsForDoctor: analysis.questions_for_doctor || [],
        glossary: (analysis.glossary || []).map((g) => ({
          term: g.term,
          definition: g.definition,
        })),
        rawTextSnippet: data.extracted_text || analysis.extracted_text_snippet || '',
        extractionMethod: data.extraction_method,
        characterCount: data.character_count,
        fileSizeBytes: data.file_size_bytes,
      };

      setActiveReport(formattedReport);
      setShowUploaderOnly(false);
    } catch (err) {
      console.error('API Error:', err);
      const detailMsg = err.response?.data?.detail || err.message || 'An error occurred while analyzing the document.';
      setError(detailMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSimulateError = () => {
    setIsAnalyzing(true);
    setError(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setError(
        'Could not extract readable text from this document. The image may be blank, out of focus, or heavily shadowed. Please upload a clear, well-lit photo or digital PDF.'
      );
    }, 900);
  };

  const handleSelectSample = async (sampleId) => {
    setError(null);
    setIsAnalyzing(true);

    try {
      // Call backend sample endpoint or fallback to local sample data
      const sampleKey = sampleId.includes('lipid') ? 'lipid' : 'cbc';
      const data = await api.getSampleReport(sampleKey);

      const analysis = data.analysis || data;
      const formattedReport = {
        id: sampleId,
        title: analysis.report_type || 'Laboratory Investigation',
        category: 'Clinical Diagnostics',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        overallStatus: analysis.overall_status || 'normal',
        patientContext: analysis.patient_context_note || 'Reference Clinical Sample',
        summary: analysis.summary,
        keyFindings: analysis.key_findings || [],
        metrics: (analysis.metrics || []).map((m) => ({
          name: m.name,
          value: m.value,
          unit: m.unit || '',
          standardRange: m.standard_range || 'Not specified in report',
          status: m.status || 'normal',
          category: 'Biomarker',
          simpleExplanation: m.simple_explanation,
        })),
        questionsForDoctor: analysis.questions_for_doctor || [],
        glossary: (analysis.glossary || []).map((g) => ({
          term: g.term,
          definition: g.definition,
        })),
        rawTextSnippet: data.extracted_text || analysis.extracted_text_snippet || '',
        extractionMethod: data.extraction_method || 'digital_pdf',
      };

      setActiveReport(formattedReport);
      setShowUploaderOnly(false);
    } catch (err) {
      // Fallback to offline sample report if backend is restarting
      const localSample = SAMPLE_REPORTS.find((s) => s.id === sampleId) || SAMPLE_REPORTS[0];
      setActiveReport(localSample);
      setShowUploaderOnly(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setActiveReport(null);
    setError(null);
    setShowUploaderOnly(true);
  };

  if (isAnalyzing) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => {
          setError(null);
          setShowUploaderOnly(true);
        }}
        onLoadSample={() => handleSelectSample(SAMPLE_REPORTS[0].id)}
      />
    );
  }

  if (activeReport && !showUploaderOnly) {
    return (
      <ReportResults
        report={activeReport}
        onReset={handleReset}
        onSelectSample={handleSelectSample}
      />
    );
  }

  return (
    <div className="space-y-8">
      <UploadZone
        onProcessFile={handleProcessFile}
        onSimulateError={handleSimulateError}
        onSelectSample={handleSelectSample}
      />
    </div>
  );
}
