<<<<<<< HEAD
// pages/arsip/page.tsx
import Archive from '../../components/Archive';
import '../../style/Archive.css';

const ArsipPage = () => {
  return (
    <div>
      <Archive />
    </div>
  );
};

export default ArsipPage;
=======
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
>>>>>>> 3720c41f7b6f9f816a147b70cea4b23939feb66f
