import ArchiveViewer from '../../components/ArchiveViewer';
import '../../style/AddDocument.css';

export const metadata = {
  title: 'Daftar Arsip - DigiArchive',
};

export default function ArsipPage() {
  return (
    <div className="page-container p-6">
      <ArchiveViewer />
    </div>
  );
}
